document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile
        ? Math.min(Math.floor(window.innerWidth * window.innerHeight / 7000), 10)
        : Math.min(Math.floor(window.innerWidth * window.innerHeight / 5000), 80);    const mouse = { x: null, y: null, radius: 100 };

    class Particle {
        constructor() {
            this.reset();
            this.color = `hsla(${Math.random() * 60 + 200}, 50%, 70%, 0.8)`;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Va chạm với mép màn hình
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -0.8;
                this.x = Math.max(0, Math.min(this.x, canvas.width));
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -0.8;
                this.y = Math.max(0, Math.min(this.y, canvas.height));
            }

            // Tương tác với chuột
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 8;
                    this.y -= Math.sin(angle) * force * 8;
                }
            }

            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = 1 - distance / 150;
                    ctx.strokeStyle = `hsla(200, 80%, 70%, ${opacity * 0.7})`;
ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update());
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    init();
    animate();
});
