let x, y, myInterval;
let d=3;

document.addEventListener('contextmenu', (event) => {
    if (!event.ctrlKey) event.preventDefault();
});

document.body.addEventListener("mousedown", (e) => {
  if (!document.querySelector(".autoscrollCursorManager")) {
    if (!e.ctrlKey && ((e.altKey && e.button === 0) || e.button === 2)) {
      e.preventDefault();
      browser.storage.sync.get(["acceleration", "interval"]).then(({ acceleration = 3, interval = 10 }) => {
        d = acceleration;
        const div = document.createElement("div");
        div.classList.add("autoscrollCursorManager");

        // Set initial position
        x = e.clientX - d;
        y = e.clientY - d;

        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        document.body.appendChild(div);

        // Start scrolling
        myInterval = setInterval(() => {
          window.scrollBy({
            top: (y - e.clientY + d),
            left: (x - e.clientX + d),
            behavior: "smooth",
          });
        }, interval);
      });
    }
  }  else {
        e.preventDefault()
        document.querySelector('.autoscrollCursorManager').remove()
        x = undefined
        y = undefined
        d = undefined

        clearInterval(myInterval)
        document.body.style.cursor = "default"
    }
});

document.addEventListener("mousemove", (e) => {
  x = e.clientX - d
  y = e.clientY - d
});
