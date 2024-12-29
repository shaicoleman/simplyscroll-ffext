let x, y, myInterval;

document.body.addEventListener("mousedown", (e) => {
  if (!document.querySelector(".autoscrollCursorManager")) {
    if ((e.ctrlKey && e.button === 0) || e.button === 1) {
      chrome.storage.sync.get(["acceleration", "interval"], ({ acceleration = 15, interval = 10 }) => {
        const div = document.createElement("div");
        div.classList.add("autoscrollCursorManager");

        x = e.clientX - acceleration;
        y = e.clientY - acceleration;

        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        document.body.appendChild(div);

        myInterval = setInterval(() => {
          window.scrollBy({
            top: y - e.clientY + acceleration,
            left: x - e.clientX + acceleration,
            behavior: "smooth",
          });
        }, interval);
      });
    }
  }
});

document.body.addEventListener("mouseup", () => {
  const manager = document.querySelector(".autoscrollCursorManager");
  if (manager) manager.remove();
  if (myInterval) clearInterval(myInterval);
});
