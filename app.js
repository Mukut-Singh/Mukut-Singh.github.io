/* ==========================================================================
   CYBERCITY INTERACTIVE SCRIPTS - APP.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Theme Manager (Dark / Light Theme Toggle)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('cyber-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('cyber-theme-dark')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
        // Force canvas colors to update
        initCanvasColors();
    });

    function setTheme(theme) {
        if (theme === 'light') {
            bodyElement.classList.remove('cyber-theme-dark');
            bodyElement.classList.add('cyber-theme-light');
            localStorage.setItem('cyber-theme', 'light');
        } else {
            bodyElement.classList.remove('cyber-theme-light');
            bodyElement.classList.add('cyber-theme-dark');
            localStorage.setItem('cyber-theme', 'dark');
        }
    }

    // 3. Mobile Navigation Menu Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMobileMenu() {
        mobileNavToggle.classList.toggle('open');
        mobileNavOverlay.classList.toggle('open');
        bodyElement.classList.toggle('overflow-hidden');
    }

    mobileNavToggle.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu if window is resized above tablet breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileNavOverlay.classList.contains('open')) {
            toggleMobileMenu();
        }
    });

    // 4. Simulated CPU Load Fluctuation
    const cpuLoadElement = document.getElementById('cpu-load');
    if (cpuLoadElement) {
        setInterval(() => {
            // Flutter load value realistically between 0.01% and 0.08%
            const loadVal = (Math.random() * 0.07 + 0.01).toFixed(2);
            cpuLoadElement.textContent = `${loadVal}%`;
        }, 3000);
    }

    // 5. Scroll Reveal Animation using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve after animating once
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 6. Neural Network Canvas Background Animation
    const canvas = document.getElementById('canvas-network');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = 60;
    let connectionDistance = 120;
    let colors = {
        particle: 'rgba(0, 240, 255, 0.5)',
        lineBase: '0, 240, 255',
        mouseLineBase: '255, 0, 85'
    };

    const mouse = {
        x: null,
        y: null,
        radius: 180
    };

    function initCanvasColors() {
        const isLight = bodyElement.classList.contains('cyber-theme-light');
        if (isLight) {
            colors.particle = 'rgba(0, 156, 184, 0.4)';
            colors.lineBase = '0, 156, 184';
            colors.mouseLineBase = '204, 0, 68';
        } else {
            colors.particle = 'rgba(0, 240, 255, 0.4)';
            colors.lineBase = '0, 240, 255';
            colors.mouseLineBase = '255, 0, 85';
        }
    }

    // Initial canvas dimensions setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust particle density based on screen size
        if (window.innerWidth < 768) {
            particleCount = 30;
            connectionDistance = 80;
        } else {
            particleCount = 65;
            connectionDistance = 130;
        }
        initParticles();
    }

    // Particles setup class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Radius
            this.speedX = Math.random() * 0.6 - 0.3; // Speed X direction
            this.speedY = Math.random() * 0.6 - 0.3; // Speed Y direction
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }

            // Mouse proximity interact
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    // Soft push away from mouse
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx / dist * force * 1.5;
                    this.y -= dy / dist * force * 1.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = colors.particle;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        const isLight = bodyElement.classList.contains('cyber-theme-light');
        const lineMaxOpacity = isLight ? 0.20 : 0.40;
        const mouseMaxOpacity = isLight ? 0.35 : 0.70;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    // Line opacity depends on proximity
                    let opacity = (1 - (dist / connectionDistance)) * lineMaxOpacity;
                    ctx.strokeStyle = `rgba(${colors.lineBase}, ${opacity.toFixed(2)})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Draw line to mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particles[i].x - mouse.x;
                let dy = particles[i].y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let opacity = (1 - (dist / mouse.radius)) * mouseMaxOpacity;
                    ctx.strokeStyle = `rgba(${colors.mouseLineBase}, ${opacity.toFixed(2)})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }

    // Set mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Start background simulation
    initCanvasColors();
    resizeCanvas();
    animate();

    // 7. Contact Terminal Encryption / Transmission Log Simulator
    const contactForm = document.getElementById('contact-form');
    const formStatusMsg = document.getElementById('form-status-msg');

    if (contactForm && formStatusMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop default navigation first to run simulation log

            const senderName = document.getElementById('sender-name').value.trim();
            const senderEmail = document.getElementById('sender-email').value.trim();
            const messageBody = document.getElementById('message-body').value.trim();

            if (!senderName || !senderEmail || !messageBody) {
                formStatusMsg.innerHTML = '<span class="text-pink">Error: Missing packet parameters.</span>';
                return;
            }

            // Simulated terminal logging
            const logs = [
                { text: 'guest@mukutsingh.io:~$ transmitting message_packet...', color: 'text-cyan', delay: 100 },
                { text: 'Checking handshake routing... Connected [OK]', color: 'text-muted', delay: 400 },
                { text: 'Negotiating TLS key (256-bit GCM)... [OK]', color: 'text-muted', delay: 800 },
                { text: 'Generating encryption hash signature... [OK]', color: 'text-muted', delay: 1200 },
                { text: 'Sending transmission payload... SUCCESS!', color: 'text-cyan text-glow', delay: 1700 }
            ];

            formStatusMsg.innerHTML = ''; // Clear status

            logs.forEach(log => {
                setTimeout(() => {
                    const line = document.createElement('div');
                    line.className = log.color;
                    line.textContent = log.text;
                    formStatusMsg.appendChild(line);
                }, log.delay);
            });

            // Redirect to mailto action after all logs are printed
            setTimeout(() => {
                const mailtoUrl = `mailto:s.mukut@iitg.ac.in?subject=Cyber-Portfolio Comms from ${encodeURIComponent(senderName)}&body=Sender: ${encodeURIComponent(senderName)} (${encodeURIComponent(senderEmail)})%0A%0AFeedback:%0A${encodeURIComponent(messageBody)}`;
                window.location.href = mailtoUrl;

                // Reset form inputs after sending
                contactForm.reset();
                
                setTimeout(() => {
                    formStatusMsg.innerHTML = '<span class="text-muted">Awaiting input...</span>';
                }, 4000);
            }, 2300);
        });
    }
});
