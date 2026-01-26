const URL = "https://teachablemachine.withgoogle.com/models/WzCktHjXW/";

let model, webcam, maxPredictions;
const PREDICTION_TIME = 1500; // Miliseccond
const THRESHOLD = 75;

var audio = new Audio("../audio/success.mp3");

const notyf = new Notyf({
  duration: 2500,
  position: {
    x: "center",
    y: "top",
  },
});

async function init() {
  // Hide the start button after click
  document.querySelector(".start-btn").style.display = "none";

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(500, 500, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
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

    if (bar) {
      bar.style.width = probability + "%";
    } else {
      console.warn(`No HTML bar found for class: bar-${className}`);
    }

    // Check if probability is above 85%
    if (probability > THRESHOLD) {
      // If this is the first time above threshold, start tracking
      if (!thresholdTracking[className]) {
        thresholdTracking[className] = {
          startTime: currentTime,
          triggered: false,
        };
      }

      // Check if it's been above threshold for 3 seconds
      const timeAboveThreshold =
        currentTime - thresholdTracking[className].startTime;

      if (
        timeAboveThreshold >= PREDICTION_TIME &&
        !thresholdTracking[className].triggered
      ) {
        // Trigger the action (only once)
        // console.log(
        //   `🎯 ACTION TRIGGERED for ${className}! Probability: ${probability}%`,
        // );

        audio.play();

        predictionData = {
          class: className,
          probability: probability,
        };

        fetch("/predict", {
          method: "POST", // Specify the method
          headers: {
            "Content-Type": "application/json; charset=UTF-8", // Indicate the content type
          },
          body: JSON.stringify(predictionData), // Convert the data to a JSON string
        });

        thresholdTracking[className].triggered = true;

        notyf.success(`${prediction[i].className} IS DETECTED!`);
      }
    } else {
      // Reset if probability drops below 85%
      if (thresholdTracking[className]) {
        delete thresholdTracking[className];
      }
    }
  }
}
