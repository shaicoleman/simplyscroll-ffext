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
    // If autoscrolling is active, stop it and prevent further handling
    if (isAutoscrolling) {
      e.preventDefault();
      e.stopPropagation();
      stopAutoscroll();
      return;
    }
    
    // Start autoscroll if not already active and target isn't a link
    if (!e.ctrlKey && !e.altKey && !isLinkOrChildOfLink(e.target)) {
      e.preventDefault(); // Prevent default middle-click behavior for non-links
      isAutoscrolling = true;
      
      // Retrieve settings from storage (with defaults)
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
        
        // Forward mousemove events from the overlay to update scrolling variables
        overlay.addEventListener("mousemove", (e) => {
          if (isAutoscrolling) {
            x = e.clientX;
            y = e.clientY;
          }
        });
        
        // Use the overlay's mousedown to stop autoscrolling on any mouse click
        overlay.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          stopAutoscroll();
        });
        
        // Prevent the context menu on the overlay during autoscroll
        overlay.addEventListener("contextmenu", (e) => {
          if (isAutoscrolling) {
            e.preventDefault();
          }
        });
        
        // Start scrolling based on mouse position relative to the initial click
        myInterval = setInterval(() => {
          const deltaY = y - initialY;
          const deltaX = x - initialX;
          
          // Calculate speeds using a scaling factor for smooth scrolling
          const speedFactor = d / 4;
          const verticalSpeed = Math.sign(deltaY) * (Math.abs(deltaY * speedFactor) / 10);
          const horizontalSpeed = Math.sign(deltaX) * (Math.abs(deltaX * speedFactor) / 10);
          
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

// Prevent context menu on the whole document during autoscroll
document.addEventListener('contextmenu', (event) => {
  if (isAutoscrolling) {
    event.preventDefault();
  }
});

// Stop autoscroll when the Escape key is pressed
document.addEventListener('keydown', (event) => {
  if (isAutoscrolling && event.key === 'Escape') {
    stopAutoscroll();
  }
});

// Helper function to determine if an element is a link or child of a link
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
