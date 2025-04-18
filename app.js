/**
 * Main application script for SlimFile
 * Handles user interactions and UI events
 */

// Set current year in footer
document.getElementById("currentYear").textContent = new Date().getFullYear();

window.addEventListener("appinstalled", () => {
  console.log("SlimFile installed!");
  gtag("event", "pwa_install", {
    event_category: "PWA",
    event_label: "SlimFile Web App",
    value: 1,
  });
});

// Detect iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const installBanner = document.getElementById('installBanner');
const closeInstallBtn = document.getElementById('closeInstallBanner');

if (isIOS && installBanner) {
  installBanner.style.display = 'block';
}

// Close the install banner
if (closeInstallBtn && installBanner) {
  closeInstallBtn.addEventListener('click', () => {
    installBanner.style.display = 'none';
  });
}

// DOM elements
const elements = {
  dropZone: document.getElementById("dropZone"),
  fileInput: document.getElementById("fileInput"),
  uploadButton: document.getElementById("uploadButton"),
  downloadBtn: document.getElementById("downloadBtn"),
  hamburgerMenu: document.getElementById("hamburgerMenu"),
  mobileNav: document.getElementById("mobileNav"),
  overlay: document.getElementById("overlay"),
  mobileNavClose: document.getElementById("mobileNavClose"),
  heroUploadButton: document.getElementById("heroUploadButton"),
};

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
  elements.mobileNav.classList.toggle("open");
  elements.overlay.classList.toggle("open");

  // Toggle hamburger menu animation (if needed)
  if (elements.hamburgerMenu) {
    const spans = elements.hamburgerMenu.querySelectorAll("span");
    if (elements.mobileNav.classList.contains("open")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  elements.mobileNav.classList.remove("open");
  elements.overlay.classList.remove("open");

  // Reset hamburger icon
  if (elements.hamburgerMenu) {
    const spans = elements.hamburgerMenu.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Upload button click
  if (elements.uploadButton) {
    elements.uploadButton.addEventListener("click", () => {
      elements.fileInput.click();
    });
  }

  // Hero upload button click
  if (elements.heroUploadButton) {
    elements.heroUploadButton.addEventListener("click", () => {
      // First scroll to the upload section (smooth scroll)
      const uploadSection = document.querySelector(".main-area .card");
      if (uploadSection) {
        uploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Focus the upload area
        setTimeout(() => {
          if (elements.dropZone) {
            elements.dropZone.classList.add("highlight");
            setTimeout(() => {
              elements.dropZone.classList.remove("highlight");
            }, 1500);
          }
        }, 800); // Delay to allow scroll to complete
      }
    });
  }

  // File input change
  if (elements.fileInput) {
    elements.fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // Drop zone events
  if (elements.dropZone) {
    elements.dropZone.addEventListener("dragover", handleDragOver);
    elements.dropZone.addEventListener("dragleave", handleDragLeave);
    elements.dropZone.addEventListener("drop", handleDrop);
  }

  // Download button
  if (elements.downloadBtn) {
    elements.downloadBtn.addEventListener("click", downloadCompressedFile);
  }

  // Mobile menu toggle
  if (elements.hamburgerMenu) {
    elements.hamburgerMenu.addEventListener("click", toggleMobileMenu);
  }

  // Mobile menu close button
  if (elements.mobileNavClose) {
    elements.mobileNavClose.addEventListener("click", closeMobileMenu);
  }

  // Overlay click to close mobile menu
  if (elements.overlay) {
    elements.overlay.addEventListener("click", closeMobileMenu);
  }

  // Close mobile menu on window resize (if viewport becomes desktop size)
  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 768 &&
      elements.mobileNav.classList.contains("open")
    ) {
      closeMobileMenu();
    }
  });
});

/**
 * Handle dragover event
 * @param {DragEvent} e - Drag event
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.dropZone.classList.add("dragover");
}

/**
 * Handle dragleave event
 * @param {DragEvent} e - Drag event
 */
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.dropZone.classList.remove("dragover");
}

/**
 * Handle drop event
 * @param {DragEvent} e - Drop event
 */
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.dropZone.classList.remove("dragover");

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0]);
  }
}

// Add CSS styles for stats
const statsStyles = document.createElement("style");
statsStyles.textContent = `
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-item {
    text-align: center;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 1.125rem;
    font-weight: 500;
}

.stat-value.success {
    color: var(--success-color);
}
`;
document.head.appendChild(statsStyles);

// Welcome animation interactivity
document.addEventListener("DOMContentLoaded", () => {
  const fileCharacter = document.querySelector(".file-character");
  const smallFile = document.querySelector(".small-file");

  // Add interactivity if the animation elements exist
  if (fileCharacter && smallFile) {
    // Make file character bounce when clicked
    fileCharacter.addEventListener("click", () => {
      fileCharacter.style.animation = "none";
      setTimeout(() => {
        fileCharacter.style.animation = "fileJump 0.4s 5 alternate";
        setTimeout(() => {
          fileCharacter.style.animation = "fileJump 1s infinite alternate";
        }, 2000);
      }, 10);
    });

    // Make small file bounce when clicked
    smallFile.addEventListener("click", () => {
      smallFile.style.animation = "none";
      setTimeout(() => {
        smallFile.style.animation = "smallFileJump 0.2s 5 alternate";
        setTimeout(() => {
          smallFile.style.animation = "smallFileJump 0.5s infinite alternate";
        }, 1000);
      }, 10);
    });
  }
});
