const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

const PORT = 5000;

let movies = [];
fs.readFile("./movies.json", (err, data) => {
  movies = JSON.parse(data.toString());
});

console.log(movies);
app.get("/movies", (req, res) => {
  let filtered = movies.filter((elem) => elem.isDeleted === "false");
  res.json(filtered);
});

app.get("/movies/:id", (req, res) => {
  let id = req.params.id;
  let filtered = movies.filter((elem) => elem.id == Number(id) && elem.isDeleted === "false");
  res.json(filtered);
});

app.post("/add", (req, res) => {
  const { id, name, isFav} = req.body;
  movies.push({
    id: movies.length+1+"",
    name: name,
    isFav: isFav,
    isDeleted: "false",
  });
  fs.writeFile("./movies.json", JSON.stringify(movies), (err, data) => {});
  let filtered = movies.filter((elem) => elem.isDeleted === "false");
  res.json(filtered);
});

app.put("/update/:id", (req, res) => {
  const updated = movies.map((element) => {
    if (element.id == req.params.id) {
      return {
        id: element.id,
        name: req.body.name,
        isFav: req.body.isFav,
        isDeleted: req.body.isDeleted,
      };
    } else return element;
  });
  fs.writeFile("./movies.json", JSON.stringify(updated), (err, data) => {});
  let filtered = movies.filter((elem) => elem.isDeleted === "false");
  res.json(filtered);
});

app.delete("/delete/:id", (req, res) => {
  let newData = movies.map((element) => {
    if (element.id == req.params.id) {
        console.log(element);
      return {
        id: element.id,
        name: element.name,
        isFav: element.isFav,
        isDeleted: "true"
      };
    } else return element;
  });
  let filtered = newData.filter((elem) => elem.isDeleted === "false");
  fs.writeFile("./movies.json", JSON.stringify(newData),(err,data)=>{});
  res.json(filtered);
});

app.listen(PORT, () => {
  console.log("server is running..");
});
