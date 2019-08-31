const express = require("express");
const connectDB = require("./config/db");
const app = express();

// Connection check with db
connectDB();

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
