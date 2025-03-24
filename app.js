let x, y, myInterval;
let d = 3;
let isAutoscrolling = false;
let initialX, initialY; // Store the initial click position
let overlay = null;    // Overlay element to block hover events

// Function to stop autoscrolling and clean up
function stopAutoscroll() {
  const cursorManager = document.querySelector('.autoscrollCursorManager');
  if (cursorManager) {
    cursorManager.remove();
  }
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
  clearInterval(myInterval);
  document.body.style.cursor = "default";
  isAutoscrolling = false;
  x = undefined;
  y = undefined;
  initialX = undefined;
  initialY = undefined;
}

// Listen for middle-click events on the body
document.body.addEventListener("mousedown", (e) => {
  // Only process middle-click (e.button === 1)
  if (e.button === 1) {
    // If already autoscrolling, stop it and return early
    if (isAutoscrolling) {
      e.preventDefault();
      stopAutoscroll();
      return;
    }
    
    // Start autoscroll if not already active and target isn't a link
    if (!e.ctrlKey && !e.altKey && !isLinkOrChildOfLink(e.target)) {
      e.preventDefault(); // Prevent default middle-click behavior for non-links
      isAutoscrolling = true;
      
      // Retrieve settings from storage
      browser.storage.sync.get(["acceleration", "interval"]).then(({ acceleration = 3, interval = 16 }) => {
        d = acceleration;
        
        // Create the autoscroll cursor indicator
        const div = document.createElement("div");
        div.classList.add("autoscrollCursorManager");
        
        // Store the initial click position
        initialX = e.clientX;
        initialY = e.clientY;
        
        // Set dynamic positioning for the cursor indicator
        div.style.left = `${initialX - d}px`;
        div.style.top = `${initialY - d}px`;
        document.body.appendChild(div);
        
        // Create an overlay to block hover events (styles defined in external CSS)
        overlay = document.createElement("div");
        overlay.classList.add("autoscrollOverlay");
        document.body.appendChild(overlay);
        
        // Forward mousemove events from the overlay to update scrolling
        overlay.addEventListener("mousemove", (e) => {
          if (isAutoscrolling) {
            x = e.clientX;
            y = e.clientY;
          }
        });
        
        // Use the overlay's mousedown to stop autoscrolling on middle-click
        overlay.addEventListener("mousedown", (e) => {
          if (e.button === 1 && isAutoscrolling) {
            e.preventDefault();
            stopAutoscroll();
            e.stopPropagation();
          }
        });
        
        // Prevent context menu on the overlay during autoscroll
        overlay.addEventListener("contextmenu", (e) => {
          if (isAutoscrolling) {
            e.preventDefault();
          }
        });
        
        // Start scrolling based on mouse position relative to the initial click
        myInterval = setInterval(() => {
          const deltaY = y - initialY;
          const deltaX = x - initialX;
          
          // Smoother acceleration using an exponential function
          const speedFactor = d / 4;
          const verticalSpeed = Math.sign(deltaY) * Math.min(Math.abs(deltaY * speedFactor) / 10, 30);
          const horizontalSpeed = Math.sign(deltaX) * Math.min(Math.abs(deltaX * speedFactor) / 10, 30);
          
          window.scrollBy({
            top: verticalSpeed,
            left: horizontalSpeed,
            behavior: "auto"
          });
        }, interval);
      });
    }
  }
});

// Helper function to determine if an element is a link or a child of a link
function isLinkOrChildOfLink(element) {
  if (element.tagName === 'A' || element.closest('a')) {
    return true;
  }
  if (element.hasAttribute('onclick') || 
      (element.hasAttribute('role') && ['button', 'link'].includes(element.getAttribute('role')))) {
    return true;
  }
  return false;
}

// Prevent context menu during autoscroll on the whole document
document.addEventListener('contextmenu', (event) => {
  if (isAutoscrolling) {
    event.preventDefault();
  }
});
