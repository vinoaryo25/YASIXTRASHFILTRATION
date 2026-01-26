const URL = "https://teachablemachine.withgoogle.com/models/WzCktHjXW/";

let model, webcam, maxPredictions;

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

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className.toLowerCase().trim(); // Added .trim() to remove hidden spaces
    const probability = (prediction[i].probability * 100).toFixed(2);

    // Try to find the bar. Example: if className is "organic", it looks for "bar-organic"
    let bar = document.getElementById(`bar-${className}`);

    if (bar) {
      bar.style.width = probability + "%";
    } else {
      // This warns you if the code can't find a bar for a specific detected class
      console.warn(`No HTML bar found for class: bar-${className}`);
    }
  }
}
