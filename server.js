const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", (req, res) => {
  const dbText = fs.readFileSync(path.join(__dirname, "db/db.json"));
  res.json(JSON.parse(dbText));
});

app.post("/api/notes", (req, res) => {
  const dbText = fs.readFileSync(path.join(__dirname, "db/db.json"));
  const dbData = JSON.parse(dbText);
  dbData.push({
    title: req.body.title,
    text: req.body.text,
    id: uuid(),
  });
  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(dbData));
  res.json(dbData.pop());
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const dbText = fs.readFileSync(path.join(__dirname, "db/db.json"));
  const dbData = JSON.parse(dbText);
  const newDbData = [];
  for (let note of dbData) {
    if (note.id != id) {
      newDbData.push(note);
    }
  }
  fs.writeFileSync(
    path.join(__dirname, "db/db.json"),
    JSON.stringify(newDbData)
  );
  res.sendStatus(200);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server up");
});
