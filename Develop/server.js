const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./uuid/uuid");

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

//API get specific notes -- need to fix this
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, result) => {
    const notes = JSON.parse(result.toString());
    const foundNote = notes.find((note) => id === note.id);
    return res.json(foundNote);
  });
});

//API get (returns a list of Notes)

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, result) => {
    const notesData = JSON.parse(result.toString());
    return res.json(notesData);
  });
});

//API post (creates a Note)

app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuid(),
    title: req.body.title,
    text: req.body.text,
  };
  fs.readFile("./db/db.json", (err, result) => {
    const data = JSON.parse(result.toString());
    data.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(data), (err, fin) => {
      return res.json(newNote);
    });
  });
});

//API put (updates a Note)

app.put("/api/notes/:id", (req, res) => {
  const updatedNote = req.body;
  fs.readFile("./db/db.json", (err, result) => {
    const notes = JSON.parse(result.toString()); // [{"id:"", "title":"", "text": ""}, ...]
    console.log(notes);
    const id = req.params.id; // "s4gds-sds4gs-23r"
    const foundNote = notes.find((note) => id === note.id);
    Object.assign(foundNote, updatedNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err, fin) => {
      return res.json(foundNote);
    });
  });
});

//api delete (deletes notes) this works but i need to figure out how to auto refresh data after a delete,

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", (err, result) => {
    const notes = JSON.parse(result.toString());
    const foundNote = notes.find((note) => id === note.id);
    console.log(notes);
    const updatedArray = JSON.stringify(notes.filter((note) => note.id != id));
    fs.writeFile("./db/db.json", updatedArray, (err, fin) => {
      res.json(updatedArray);
      return updatedArray;
    });
  });
});

//spin up server
app.listen(PORT, () =>
  console.log(`Your app is running at http://localhost:${PORT} `)
);
