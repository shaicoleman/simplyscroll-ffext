document.addEventListener("DOMContentLoaded", () => {
  const accelerationInput = document.getElementById("acceleration");
  const intervalInput = document.getElementById("interval");
  const saveButton = document.getElementById("save");

  browser.storage.sync.get(["acceleration", "interval"]).then((data) => {
    accelerationInput.value = data.acceleration || 3;
    intervalInput.value = data.interval || 10;
  });

  saveButton.addEventListener("click", () => {
    const acceleration = parseFloat(accelerationInput.value);
    const interval = parseInt(intervalInput.value, 10);
    browser.storage.sync.set({ acceleration, interval }).then(() => {
      alert("Settings saved!");
    });
  });
});
