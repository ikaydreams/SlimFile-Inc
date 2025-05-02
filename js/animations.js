// Animations for SlimFile Inc. website

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Initialize animations when elements are in view
    initInViewAnimations();
    
    // Add interactive elements to cartoon animations
    enhanceCartoonAnimations();
    
    // Add particle effect to hero section
    createParticleEffect();
});

// Animation for elements when they come into view
function initInViewAnimations() {
    // Get all elements to animate
    const animElements = document.querySelectorAll('.feature-card, .step, .carousel-container');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add animation class when element is in viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options
        root: null, // viewport
        threshold: 0.2, // 20% of element visible
        rootMargin: '0px'
    });
    
    // Observe each element
    animElements.forEach(element => {
        observer.observe(element);
        
        // Add base animation class
        element.classList.add('anim-ready');
    });
}

// Add interactive elements to Lottie animations
function enhanceCartoonAnimations() {
    // Add hover effect to feature icon animations
    document.querySelectorAll('.feature-icon lottie-player').forEach(animation => {
        const featureCard = animation.closest('.feature-card');
        
        // Speed up animation on hover
        featureCard.addEventListener('mouseenter', () => {
            animation.setAttribute('speed', '1.5');
        });
        
        // Return to normal speed on mouse leave
        featureCard.addEventListener('mouseleave', () => {
            animation.setAttribute('speed', '1');
        });
    });
    
    // Add interaction to step animations
    document.querySelectorAll('.step-animation lottie-player').forEach(animation => {
        const step = animation.closest('.step');
        
        // Play animation when step is clicked
        step.addEventListener('click', () => {
            // Reset animation
            animation.seek(0);
            // Make sure animation is playing
            animation.play();
        });
    });
}

// Create a more cartoon-style animated background effect for the hero section

    
    // Add floating cartoon bubbles
    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'cartoon-bubble';
        const size = Math.random() * 30 + 20;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 90 + 5 + '%';
        bubble.style.top = Math.random() * 60 + 10 + '%';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        bubble.style.opacity = Math.random() * 0.5 + 0.2;
        heroSection.appendChild(bubble);
    }
    
    // Create canvas element for particles
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    // Add canvas to hero section as first child
    heroSection.insertBefore(canvas, heroSection.firstChild);
    
    // Set canvas size
    const resizeCanvas = () => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    };
    
    // Call resize on load and on window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Get canvas context
    const ctx = canvas.getContext('2d');
    
    // Particle configuration - more cartoon-like
    const particleConfig = {
        count: 70,
        colors: ['#9f7aea', '#d264b6', '#f06292'],
        minSize: 5,
        maxSize: 20,
        minSpeed: 0.5,
        maxSpeed: 2,
        opacity: 0.8,
        shapes: ['circle', 'square', 'triangle', 'star'] // Add variety with different shapes
    };
    
    // Create particles array
    const particles = [];
    
    // Helper function to draw a star
    function drawStar(ctx, x, y, radius, points, innerRadius) {
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? radius : innerRadius;
            const angle = (Math.PI * i) / points;
            ctx.lineTo(x + r * Math.sin(angle), y + r * Math.cos(angle));
        }
        ctx.closePath();
    }
    
    // Function to draw different shapes
    function drawShape(ctx, x, y, radius, shape, color, opacity) {
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        
        switch(shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'square':
                ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
                break;
                
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(x, y - radius);
                ctx.lineTo(x + radius, y + radius);
                ctx.lineTo(x - radius, y + radius);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'star':
                drawStar(ctx, x, y, radius, 5, radius/2);
                ctx.fill();
                break;
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Initialize particles with random shapes
    for (let i = 0; i < particleConfig.count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize,
            color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
            speedX: (Math.random() * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed) * (Math.random() > 0.5 ? 1 : -1),
            speedY: (Math.random() * (particleConfig.maxSpeed - particleConfig.minSpeed) + particleConfig.minSpeed) * (Math.random() > 0.5 ? 1 : -1),
            opacity: Math.random() * particleConfig.opacity + 0.3,
            shape: particleConfig.shapes[Math.floor(Math.random() * particleConfig.shapes.length)],
            rotation: 0,
            rotationSpeed: Math.random() * 0.05 * (Math.random() > 0.5 ? 1 : -1),
            pulseDirection: Math.random() > 0.5 ? 1 : -1,
            pulseSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    // Animation function with more cartoon-like behaviors
    function animateParticles() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each particle
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off walls with slight random angle change for more playful movement
            if (particle.x + particle.radius > canvas.width || particle.x - particle.radius < 0) {
                particle.speedX = -particle.speedX;
                // Add slight random variation to make it more playful
                particle.speedY += (Math.random() - 0.5) * 0.3;
            }
            
            if (particle.y + particle.radius > canvas.height || particle.y - particle.radius < 0) {
                particle.speedY = -particle.speedY;
                // Add slight random variation to make it more playful
                particle.speedX += (Math.random() - 0.5) * 0.3;
            }
            
            // Cartoon-like rotation for non-circles
            particle.rotation += particle.rotationSpeed;
            
            // Cartoon-like pulsing size
            particle.radius += particle.pulseSpeed * particle.pulseDirection;
            if (particle.radius > particleConfig.maxSize || particle.radius < particleConfig.minSize) {
                particle.pulseDirection *= -1;
            }
            
            // Save context for rotation
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            
            // Draw the shape at origin (0,0) since we've translated the context
            drawShape(ctx, 0, 0, particle.radius, particle.shape, particle.color, particle.opacity);
            
            // Restore context
            ctx.restore();
        });
        
        // Call next frame
        requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animateParticles();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Animation ready state */
    .anim-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    /* Animated state */
    .anim-ready.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Animation delays for sequential elements */
    .feature-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .feature-card:nth-child(3) {
        transition-delay: 0.4s;
    }
    
    /* Text highlight animation */
    @keyframes highlight {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }
    
    .hero-title, .section-header h2 {
        background-size: 200% auto;
        animation: highlight 5s ease infinite;
    }
`;

document.head.appendChild(style);
