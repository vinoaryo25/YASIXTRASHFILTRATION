var express = require("express");
var path = require("path");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const ARDUINO_PORT = 8;

const app = express();
const PORT = 3500;

app.set("view engine", "ejs");
app.set("views", "public/pages");
app.use(express.static(path.join(__dirname, "public/src")));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const port = new SerialPort({ path: "COM" + ARDUINO_PORT, baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

port.on("open", () => {
  console.log("serial port open");
});

parser.on("data", (data) => {
  console.log("ARDUINO: ", data);
});

port.on("error", (err) => {
  console.error("Serial port error:", err.message);
  if (err.message.includes("Access denied")) {
    console.log(`\n⚠️  COM${ARDUINO_PORT} is in use. Please:`);
    console.log("  1. Close Arduino IDE Serial Monitor");
    console.log("  2. Check if another app is using the port");
    console.log("  3. Verify the correct port in Device Manager");
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/predict", (req, res) => {
  CLASS = req.body.class;
  PROBABILTIY = req.body.probability;

  switch (CLASS) {
    case "organik":
      port.write("A");
      break;
    case "anorganik":
      port.write("B");
      break;
    case "b3":
      port.write("C");
      break;
  }

  console.log(`PREDICTED ${CLASS} is ${PROBABILTIY}%`);
  res.json({ success: true, class: CLASS, probability: PROBABILTIY });
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
