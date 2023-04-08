const router = require("express").Router();
const blog = require("../api/blog.json");
const fs = require("fs");
const fsPath = "./api/blog.json";

// System Design
// You should have the following routes:

// [x] (GET) Endpoint that will display all comments from the database. In lieu of database, we use our blog.json file.
router.get("/", (req, res) => {
  try {
    res.status(200).json({
      results: blog,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// [x] (GET) Endpoint that will display one comment from the database selected by its post_id
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;

    //   let character = blog.filter((obj) => obj.id == id);
    let character = blog.filter((obj) => obj.post_id == id);
    res.status(200).json({
      status: `Found character at id: ${id}`,
      character,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// [x] (POST) Endpoint that will allow us to create a new entry which will be appended to the .json file's outermost array.
router.post("/create", (req, res) => {

  try {
    // Object Destructuring to help individually grab the keys & values (properties) of our character object coming from req.body
    let { title, author, body } = req.body;

    // In your entry creation route, create a feature that will check where your makeshift db is in terms of its id's and creates a new one for each entry.

    // Use math to create an id for the new entry
    let newId = blog.length + 1;

    // Declare and assign newEntry object
    const newEntry = {
      post_id: newId,
      title,
      author,
      body,
    };

    fs.readFile(fsPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      // Create a way to make sure nothing has the same ID
      
      console.log(
        "ID values: ",
        database.filter((d) => {
          if (d) {
            return d.id;
          }
        })
      );

      let currentIDs = [];

      database.forEach((obj) => {
        currentIDs.push(obj.id);
      });

      if (currentIDs.includes(newId)) {
        let maxValue = Math.max(...currentIDs);
        newId = maxValue + 1;
        newEntry.id = newId;
      }

      database.push(newEntry);

      fs.writeFile(fsPath, JSON.stringify(database), (err) => {
        // console.log(err);
        res.status(200).json({
          status: `Created New Entry,${newEntry.title}!`,
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// [x] (PUT) Endpoint that will allow us to update an existing entry once a match has been found. The search should be done via a query parameter, whereas update information should be enclosed within the body.

router.put("/:id", (req, res) => {
  // console.log(req.body)
  // console.log(req.params.id)

    try {
      const id = Number(req.params.id);
      const updatedInfo = req.body; // The body object coming in is the new info.
      fs.readFile(fsPath, (err, data) => {
        if (err) throw err;
  
        const database = JSON.parse(data);
        let entry;
        database.forEach((obj, i) => {
          if (obj.post_id === id) {
            let buildObj = {};
  
            for (key in obj) {
              if (updatedInfo[key]) {
                // console.log("Checked");
                buildObj[key] = updatedInfo[key];
              } else {
                buildObj[key] = obj[key];
              }
            }
            database[i] = buildObj;
            entry = buildObj;
          }
        });
        // Error message for if that id isn't in the DB
        if (Object.keys(entry).length <= 0) res.status(404).json({ message: "No entry present." });
  
              fs.writeFile(fsPath, JSON.stringify(database), err => console.log(err)); //! logging null
  
              res.status(200).json({
                  status: `Modified character at ID: ${id}.`,
                  entry: entry
              })
  
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }

  });


// [x] (DELETE) Endpoint that will allow us to delete an entry from our .json file. This should be done thru the utilization of the parameter.

router.delete("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        fs.readFile(fsPath, (err, data) => {
            if (err) throw err;
            const db = JSON.parse(data);

            const filteredDb = db.filter(i => i.post_id !== id);

            fs.writeFile(fsPath, JSON.stringify(filteredDb), err => console.log(err));

            res.status(200).json({
                status: `ID: entry at ${id} was successfully deleted.`,
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
          });
    }
})


/* 
In order to accomplish this task, you will need to import your fs dependency into your controller.

HINT FS methods require two parameters: a string of file location, and a callback function taking error and data parameters. Make sure to parse the .json file when you need to traverse through it. Make sure to turn it back into a string before you write to it. Look at its data type and see if there's something you know that would help you add the data.
*/

/*
Icebox Challenges
- [ ] Existing setup requires us to keep track of the `post_id`. In your entry creation route, create a feature that will check where your makeshift db is in terms of its id's and creates a new one for each entry. Don't overthink it. A simple counter-style 1, 2, 3 is sufficient.

- [ ] If you're feeling extra confident, create static files that will serve up the content to the user using DOM and fetch to retrieve the data from the server. These files are then served by ALL blog posts endpoint as well as ONE blog post endpoint.
*/

module.exports = router;
