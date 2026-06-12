// --- CANVAS PARTICLE NETWORK BACKGROUND ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Boundary check
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse interaction (Floating away from mouse)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }

        // Move normally
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        // Cyberpunk colors: orange or cyan
        let color = Math.random() > 0.5 ? '#FF4500' : '#00F0FF';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();

// --- SCROLL REVEAL ANIMATION ---
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// --- NUMBER COUNTER ANIMATION ---
const counters = document.querySelectorAll('.stat-num');
let hasCounted = false;

const startCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);

        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                const isPercentage = target === 99.9;
                counter.innerText = target.toLocaleString() + (isPercentage ? '%' : '+');
            }
        };
        updateCounter();
    });
};

const statsSection = document.getElementById('stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            startCounters();
            hasCounted = true;
        }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// --- NAVIGATION SCROLL EFFECT ---
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- PHOTO GALLERY MODAL ---
const galleryModal = document.getElementById('gallery-modal');
const openGalleryBtn = document.getElementById('open-gallery-btn');
const closeGalleryBtn = document.querySelector('.close-gallery');

if (openGalleryBtn && galleryModal && closeGalleryBtn) {
    openGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        galleryModal.style.display = 'block';
        // Small delay to allow display: block to apply before animating opacity
        setTimeout(() => galleryModal.classList.add('show'), 10);
        
        // Close mobile menu if it's open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        }
    });

    const closeModal = () => {
        galleryModal.classList.remove('show');
        setTimeout(() => {
            galleryModal.style.display = 'none';
        }, 400); // Wait for transition
    };

    closeGalleryBtn.addEventListener('click', closeModal);

    // Close when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeModal();
        }
    });
}

// --- CUSTOM CURSOR ---
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', function (e) {
    // Get current HTML zoom level to fix cursor offset
    const htmlZoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    const posX = e.clientX / htmlZoom;
    const posY = e.clientY / htmlZoom;

    if (cursorDot && cursorOutline) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth outline follow
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    }
});

document.addEventListener('mousedown', () => {
    if (cursorOutline) {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.backgroundColor = "rgba(0, 240, 255, 0.2)";
    }
});

document.addEventListener('mouseup', () => {
    if (cursorOutline) {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.backgroundColor = "transparent";
    }
});

// --- PARALLAX 3D HERO ICONS ---
const heroSection = document.querySelector('.hero');
const floatingModels = document.querySelectorAll('.floating-model');

if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;

        floatingModels.forEach((model, index) => {
            const speed = (index + 1) * 2;
            model.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });
}

// --- MOBILE HAMBURGER MENU ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// --- SMOOTH SCROLL & SECTION FOCUS ANIMATION ---
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });

            targetSection.classList.remove('section-focus');
            void targetSection.offsetWidth;
            targetSection.classList.add('section-focus');
        }
    });
});

// --- MULTILINE TYPEWRITER EFFECT ---
const typeWriterElement = document.querySelector('.typewriter-text');
if (typeWriterElement) {
    const text = typeWriterElement.getAttribute('data-text');
    let index = 0;
    
    function type() {
        if (index < text.length) {
            typeWriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 30); // 30ms per character for smooth fast typing
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 800);
}
