// Intro Loading Animation
document.addEventListener("DOMContentLoaded", function () {
  const introOverlay = document.getElementById("introOverlay");
  const loadingFill = document.getElementById("loadingFill");
  const loadingPercent = document.getElementById("loadingPercent");

  let progress = 0;
  const duration = 3500; // 3.5 seconds loading time
  const interval = 30; // Update every 30ms
  const increment = 100 / (duration / interval);

  // Prevent scrolling during intro
  document.body.style.overflow = "hidden";

  // Loading animation
  const loadingInterval = setInterval(() => {
    progress += increment;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      // Wait a moment at 100% before fading out
      setTimeout(() => {
        introOverlay.classList.add("fade-out");

        // Re-enable scrolling after intro
        setTimeout(() => {
          document.body.style.overflow = "";
          introOverlay.style.display = "none";
        }, 800);
      }, 500);
    }

    // Update progress bar and text
    loadingFill.style.width = progress + "%";
    loadingPercent.textContent = Math.floor(progress) + "%";
  }, interval);

  // Add some random loading messages for authenticity
  const loadingMessages = [
    "LOADING AI MODEL...",
    "INITIALIZING SENSORS...",
    "CALIBRATING SYSTEM...",
    "PREPARING INTERFACE...",
    "SYSTEM READY...",
  ];

  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    if (messageIndex < loadingMessages.length) {
      const loadingText = document.querySelector(".loading-text");
      loadingText.innerHTML =
        loadingMessages[messageIndex] +
        ' <span id="loadingPercent">' +
        Math.floor(progress) +
        "%</span>";
      messageIndex++;
    } else {
      clearInterval(messageInterval);
    }
  }, duration / loadingMessages.length);
});
