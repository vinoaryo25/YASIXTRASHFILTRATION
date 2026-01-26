var express = require("express");
var path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "public/pages");
app.use(express.static(path.join(__dirname, "public/src")));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/predict", (req, res) => {
  CLASS = req.body.class;
  PROBABILTIY = req.body.probability;

  console.log(`PREDICTED ${CLASS} is ${PROBABILTIY}%`);
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
