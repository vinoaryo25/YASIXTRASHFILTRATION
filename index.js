var express = require("express");
var path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "public/pages");
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/src")));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
