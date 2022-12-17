const express = require("express");
const path = require("path");
const notesData = require("./db/db.json");

const PORT = process.env.PORT || 3001;
const app = express();

//our middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//HTML
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

//API get

app.get("/api/notes", (req, res) => res.json(notesData));

//API post

//API get specific notes

//spin up server
app.listen(PORT, () =>
  console.log(`Your app is running at http://localhost:${PORT} `)
);
