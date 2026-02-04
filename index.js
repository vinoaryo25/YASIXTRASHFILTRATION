// Dependencies
const express = require("express");
const path = require("path");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// Configuration
const PORT = 3500;
const SERIAL_PORT_PATH = "COM4";
const BAUD_RATE = 9600;
const DELIMITER = "\n";
const VIEW_ENGINE = "ejs";
const VIEWS_PATH = "public/pages";
const STATIC_PATH = path.join(__dirname, "public/src");

// Waste Classification Mapping
const WASTE_COMMANDS = {
  organik: "A",
  anorganik: "B",
  b3: "C",
};

// Database
const database_log = [];

// Initialize Express
const app = express();

// Initialize Serial Port
const serialPort = new SerialPort({
  path: SERIAL_PORT_PATH,
  baudRate: BAUD_RATE,
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: DELIMITER }));

// Middleware
app.set("view engine", VIEW_ENGINE);
app.set("views", VIEWS_PATH);
app.use(express.static(STATIC_PATH));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility Functions
function Log(...messages) {
  const message = messages.join(" ");
  database_log.push(message);
  console.log(`[LOG] ${message}`);
}

function handleSerialError(err) {
  console.error("Serial port error:", err.message);
  if (err.message.includes("Access denied")) {
    Log("\n⚠️  Port is in use. Please:");
    Log("  1. Close Arduino IDE Serial Monitor");
    Log("  2. Check if another app is using the port");
    Log("  3. Verify the correct port in Device Manager");
  }
}

function sendWasteCommand(wasteClass) {
  const command = WASTE_COMMANDS[wasteClass];
  if (command) {
    serialPort.write(command);
    return true;
  }
  return false;
}

// Serial Port Event Handlers
serialPort.on("open", () => {
  Log("serial port open");
});

parser.on("data", (data) => {
  Log("ARDUINO:", data);
});

serialPort.on("error", handleSerialError);

// Routes
app.get("/log", (req, res) => {
  res.render("log.ejs", {
    logs: database_log,
    config: {
      serialPort: SERIAL_PORT_PATH,
      baudRate: BAUD_RATE,
    },
  });
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/predict", (req, res) => {
  const { class: wasteClass, probability } = req.body;

  const success = sendWasteCommand(wasteClass);

  if (success) {
    Log(`PREDICTED ${wasteClass} is ${probability}%`);
    res.json({ success: true, class: wasteClass, probability });
  } else {
    res.status(400).json({
      success: false,
      error: "Invalid waste class",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  Log(`Server started at ${PORT}`);
});
