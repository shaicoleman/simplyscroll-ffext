document.addEventListener("DOMContentLoaded", () => {
  const accelerationInput = document.getElementById("acceleration");
  const intervalInput = document.getElementById("interval");
  const saveButton = document.getElementById("save");

  chrome.storage.sync.get(["acceleration", "interval"], (data) => {
    accelerationInput.value = data.acceleration || 15;
    intervalInput.value = data.interval || 10;
  });

  saveButton.addEventListener("click", () => {
    const acceleration = parseFloat(accelerationInput.value);
    const interval = parseInt(intervalInput.value, 10);
    chrome.storage.sync.set({ acceleration, interval }, () => {
      alert("Settings saved!");
    });
  });
});
