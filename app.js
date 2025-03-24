let x, y, myInterval;
let d = 3;
let isAutoscrolling = false;
let initialX, initialY; // Store the initial click position

// Only prevent context menu during autoscrolling
document.addEventListener('contextmenu', (event) => {
    if (isAutoscrolling) {
        event.preventDefault();
    }
});

document.body.addEventListener("mousedown", (e) => {
  if (!isAutoscrolling) {
    if (e.button === 1 && !e.ctrlKey && !e.altKey && !isLinkOrChildOfLink(e.target)) {
      e.preventDefault(); // Prevent default middle-click behavior for non-links
      isAutoscrolling = true;
      
      browser.storage.sync.get(["acceleration", "interval"]).then(({ acceleration = 3, interval = 16 }) => {
        d = acceleration;
        const div = document.createElement("div");
        div.classList.add("autoscrollCursorManager");
        
        // Store initial click position
        initialX = e.clientX;
        initialY = e.clientY;
        
        // Set fixed position for the autoscroll icon
        div.style.left = `${initialX - d}px`;
        div.style.top = `${initialY - d}px`;
        document.body.appendChild(div);
        
        // Start scrolling based on current mouse position relative to initial position
        myInterval = setInterval(() => {
          // Calculate the distance from current position to initial click position
          const deltaY = y - initialY;
          const deltaX = x - initialX;
          
          // Use exponential function for smoother acceleration
          const speedFactor = d / 5;
          const verticalSpeed = Math.sign(deltaY) * Math.min(Math.abs(deltaY * speedFactor) / 10, 30);
          const horizontalSpeed = Math.sign(deltaX) * Math.min(Math.abs(deltaX * speedFactor) / 10, 30);
          
          window.scrollBy({
            top: verticalSpeed,
            left: horizontalSpeed,
            behavior: "auto", // Using auto for more consistent scrolling
          });
        }, interval);
      });
    }
  } else {
      e.preventDefault();
      const cursorManager = document.querySelector('.autoscrollCursorManager');
      if (cursorManager) {
          cursorManager.remove();
      }
      clearInterval(myInterval);
      document.body.style.cursor = "default";
      isAutoscrolling = false;
      x = undefined;
      y = undefined;
      initialX = undefined;
      initialY = undefined;
  }
});

document.addEventListener("mousemove", (e) => {
  if (isAutoscrolling) {
    // Update x and y for scroll calculations, but don't move the cursor indicator
    x = e.clientX;
    y = e.clientY;
    
    // We don't update the cursor position anymore, it stays fixed where initially clicked
    // Remove the immediate scrolling in mousemove to prevent jumpiness
  }
});

// Helper function to determine if an element is a link or child of a link
function isLinkOrChildOfLink(element) {
    // Check if the element itself is a link
    if (element.tagName === 'A' || element.closest('a')) {
        return true;
    }
    
    // Check if the element has an onclick handler or other interactive behaviors
    if (element.hasAttribute('onclick') || 
        (element.hasAttribute('role') && ['button', 'link'].includes(element.getAttribute('role')))) {
        return true;
    }
    
    return false;
}
