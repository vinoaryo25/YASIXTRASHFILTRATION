const URL = "https://teachablemachine.withgoogle.com/models/WzCktHjXW/";

let model, webcam, maxPredictions;
const PREDICTION_TIME = 1500; // Milliseconds
const THRESHOLD = 75;

var audio = new Audio("../audio/success.wav");

const notyf = new Notyf({
  duration: 2500,
  position: {
    x: "center",
    y: "top",
  },
});

async function init() {
  // Hide the start screen
  const startScreen = document.querySelector(".start-screen");
  if (startScreen) {
    startScreen.style.display = "none";
  }

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(600, 600, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  const container = document.getElementById("webcam-container");
  container.appendChild(webcam.canvas);

  // Ensure canvas is visible
  webcam.canvas.style.display = "block";
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

const thresholdTracking = {};

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  const currentTime = Date.now();

  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className.toLowerCase().trim();
    const probability = (prediction[i].probability * 100).toFixed(2);

    // Update the bar
    let bar = document.getElementById(`bar-${className}`);
    let confidenceDisplay = document.getElementById(`confidence-${className}`);

    if (bar) {
      bar.style.width = probability + "%";

      // Update confidence display
      if (confidenceDisplay) {
        confidenceDisplay.textContent = probability + "%";
      }
    } else {
      console.warn(`No HTML bar found for class: bar-${className}`);
    }

    // Check if probability is above threshold
    if (probability > THRESHOLD) {
      // If this is the first time above threshold, start tracking
      if (!thresholdTracking[className]) {
        thresholdTracking[className] = {
          startTime: currentTime,
          triggered: false,
        };
      }

      // Check if it's been above threshold for the specified time
      const timeAboveThreshold =
        currentTime - thresholdTracking[className].startTime;

      if (
        timeAboveThreshold >= PREDICTION_TIME &&
        !thresholdTracking[className].triggered
      ) {
        // Trigger the action (only once)
        audio.play();

        predictionData = {
          class: className,
          probability: probability,
        };

        fetch("/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(predictionData),
        }).catch((err) => {
          console.log("Server endpoint not available:", err);
        });

        thresholdTracking[className].triggered = true;

        // Format the class name for display
        const displayName = prediction[i].className.toUpperCase();
        notyf.success(`${displayName} DETECTED!`);

        // Add visual feedback to the detected category
        const categoryCard = bar.closest(".category-card");
        if (categoryCard) {
          categoryCard.style.animation = "none";
          setTimeout(() => {
            categoryCard.style.animation = "detectionPulse 0.5s ease-in-out";
          }, 10);
        }
      }
    } else {
      // Reset if probability drops below threshold
      if (thresholdTracking[className]) {
        delete thresholdTracking[className];
      }
    }
  }
}

// Add detection pulse animation
const style = document.createElement("style");
style.textContent = `
  @keyframes detectionPulse {
    0%, 100% { 
      transform: scale(1) translateY(0); 
      box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
    }
    50% { 
      transform: scale(1.05) translateY(-10px); 
      box-shadow: 16px 16px 0px rgba(0, 0, 0, 0.4);
    }
  }
`;
document.head.appendChild(style);
