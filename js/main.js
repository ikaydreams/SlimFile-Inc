// Main JavaScript for SlimFile Inc. website - Optimized Version

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Initialize all components
    initNavbar();
    initCarousels();
    initScrollToTop();
    initAnimations();
    initSmoothScrolling();
});

// Initialize navbar with proper error handling
function initNavbar() {
    try {
        const hamburger = document.getElementById('hamburgerMenu');
        const mobileNav = document.getElementById('mobileNav');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('mobileNavClose');

        // Only proceed if all elements exist
        if (hamburger && mobileNav && overlay && closeBtn) {
            // Toggle mobile menu
            hamburger.addEventListener('click', function() {
                mobileNav.classList.toggle('open');
                overlay.classList.toggle('open');
                document.body.classList.toggle('no-scroll');
                toggleHamburgerAnimation(hamburger);
            });

            // Close mobile menu
            closeBtn.addEventListener('click', function() {
                closeMobileMenu(hamburger, mobileNav, overlay);
            });

            // Close when clicking overlay
            overlay.addEventListener('click', function() {
                closeMobileMenu(hamburger, mobileNav, overlay);
            });

            // Close when clicking nav links
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileMenu(hamburger, mobileNav, overlay);
                });
            });

            // Change navbar background on scroll
            window.addEventListener('scroll', function() {
                const header = document.querySelector('header');
                if (header) {
                    if (window.scrollY > 50) {
                        header.style.backgroundColor = 'rgba(26, 32, 44, 0.95)';
                        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
                    } else {
                        header.style.backgroundColor = 'rgba(26, 32, 44, 0.95)';
                        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }
                }
            });
        } else {
            console.log('Some navbar elements not found - mobile menu disabled');
        }
    } catch (error) {
        console.error('Navbar initialization error:', error);
    }
}

// Helper function to close mobile menu
function closeMobileMenu(hamburger, mobileNav, overlay) {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    resetHamburgerAnimation(hamburger);
}

// Toggle hamburger animation
function toggleHamburgerAnimation(hamburger) {
    if (!hamburger) return;
    
    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
        if (hamburger.classList.contains('open')) {
            resetHamburgerAnimation(hamburger);
        } else {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            hamburger.classList.add('open');
        }
    }
}

// Reset hamburger animation
function resetHamburgerAnimation(hamburger) {
    if (!hamburger) return;
    
    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        hamburger.classList.remove('open');
    }
}

// Initialize carousels
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        try {
            const track = carousel.querySelector('.carousel-track');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevBtn = carousel.querySelector('.carousel-button.prev');
            const nextBtn = carousel.querySelector('.carousel-button.next');
            const slideWidth = 100; // 100% width
            let currentIndex = 0;
            let autoSlideInterval;

            if (!track || !slides.length || !prevBtn || !nextBtn) {
                console.log('Carousel elements not found - skipping initialization');
                return;
            }

            // Set initial position
            updateCarouselPosition(track, currentIndex, slideWidth);

            // Previous button click handler
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
                updateCarouselPosition(track, currentIndex, slideWidth);
                resetAutoSlide();
            });

            // Next button click handler
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                updateCarouselPosition(track, currentIndex, slideWidth);
                resetAutoSlide();
            });

            // Auto-advance carousels
            function startAutoSlide() {
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                    updateCarouselPosition(track, currentIndex, slideWidth);
                }, 5000);
            }

            function resetAutoSlide() {
                clearInterval(autoSlideInterval);
                startAutoSlide();
            }

            startAutoSlide();

            // Pause on hover
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                startAutoSlide();
            });

        } catch (error) {
            console.error('Carousel initialization error:', error);
        }
    });
}

// Update carousel position
function updateCarouselPosition(track, index, slideWidth) {
    if (track) {
        track.style.transform = `translateX(-${index * slideWidth}%)`;
    }
}

// Initialize scroll to top button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when button is clicked
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize animations
function initAnimations() {
    // Add animations to various elements
    const elementsToAnimate = [
        { selector: '.hero-animation', animation: 'floating' },
        { selector: '.cta-animation', animation: 'bouncing' },
        { selector: '.btn-primary', animation: 'pulsing' },
        { selector: '.feature-card', animation: 'shaking' },
        { selector: '.step-number', animation: 'wobbling' },
        { selector: '.carousel-button', animation: 'popping' }
    ];

    elementsToAnimate.forEach(item => {
        document.querySelectorAll(item.selector).forEach(element => {
            element.classList.add(item.animation);
        });
    });
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Handle special case for # links
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            // Scroll to the target element
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Set current year in footer if element exists
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}