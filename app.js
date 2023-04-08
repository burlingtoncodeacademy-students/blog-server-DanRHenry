const express = require("express");
const app = express();
const PORT = 4450;

// Controllers
const entry = require("./controllers/routes");

// Middleware
app.use(express.json());

// Routes
app.use("/entry", entry);
app.listen(PORT, () => {
    console.log(`The server is running on PORT: ${PORT}`);
})