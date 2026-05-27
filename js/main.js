/**
 * Xintao Network Technology Co., Ltd.
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ========================================
    // Background Particle Animation
    // ========================================
    class ParticleAnimation {
        constructor() {
            this.canvas = document.getElementById('bg-canvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = 50;
            this.mouse = { x: 0, y: 0 };
            this.colors = ['#00d4ff', '#0077ff', '#00ff88'];
            
            this.init();
            this.animate();
            this.setupEventListeners();
        }

        init() {
            this.resize();
            
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push(this.createParticle());
            }
        }

        createParticle() {
            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.4 + 0.1,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            };
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw connections
            this.drawConnections();
            
            // Update and draw particles
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.pulsePhase += particle.pulseSpeed;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > this.canvas.width) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > this.canvas.height) {
                    particle.vy *= -1;
                }
                
                // Mouse interaction
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    particle.x -= dx * 0.01;
                    particle.y -= dy * 0.01;
                }
                
                // Draw particle with pulse effect
                const pulseAlpha = particle.alpha + Math.sin(particle.pulsePhase) * 0.2;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = Math.max(0.1, Math.min(1, pulseAlpha));
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            });
            
            requestAnimationFrame(() => this.animate());
        }

        drawConnections() {
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = '#00d4ff';
                        this.ctx.globalAlpha = (1 - distance / 150) * 0.2;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                        this.ctx.globalAlpha = 1;
                    }
                }
            }
        }

        setupEventListeners() {
            window.addEventListener('resize', () => {
                this.resize();
            });
            
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }
    }

    // ========================================
    // Navigation
    // ========================================
    class Navigation {
        constructor() {
            this.nav = document.querySelector('.nav');
            this.navToggle = document.querySelector('.nav-toggle');
            this.navMenu = document.querySelector('.nav-menu');
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.handleScroll());
            if (this.navToggle) {
                this.navToggle.addEventListener('click', () => this.toggleMenu());
            }
            
            // Close menu when clicking a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.navMenu) {
                        this.navMenu.classList.remove('active');
                    }
                    if (this.navToggle) {
                        this.navToggle.classList.remove('active');
                    }
                });
            });
        }

        handleScroll() {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        }

        toggleMenu() {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        }
    }

    // ========================================
    // Scroll Animations
    // ========================================
    class ScrollAnimations {
        constructor() {
            this.elements = document.querySelectorAll('.animate-on-scroll');
            if (!this.elements.length) return;
            
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // Counter Animation
    // ========================================
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number');
            if (!this.counters.length) return;
            
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                        this.animateCounter(entry.target);
                        entry.target.classList.add('counted');
                    }
                });
            }, { threshold: 0.5 });
            
            this.counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const suffix = element.getAttribute('data-suffix') || '';
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    element.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target + suffix;
                }
            };
            
            updateCounter();
        }
    }

    // ========================================
    // Smooth Scroll
    // ========================================
    class SmoothScroll {
        constructor() {
            this.links = document.querySelectorAll('a[href^="#"]');
            this.init();
        }

        init() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }

    // ========================================
    // Form Handling
    // ========================================
    class FormHandler {
        constructor() {
            this.forms = document.querySelectorAll('form');
            if (!this.forms.length) return;
            
            this.init();
        }

        init() {
            this.forms.forEach(form => {
                form.addEventListener('submit', (e) => this.handleSubmit(e, form));
            });
        }

        handleSubmit(e, form) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 2000);
            }, 1500);
        }
    }

    // ========================================
    // Parallax Effect
    // ========================================
    class ParallaxEffect {
        constructor() {
            this.elements = document.querySelectorAll('[data-parallax]');
            if (!this.elements.length) return;
            
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.update());
        }

        update() {
            const scrolled = window.pageYOffset;
            
            this.elements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // ========================================
    // 3D Card Effect
    // ========================================
    class Card3DEffect {
        constructor() {
            this.cards = document.querySelectorAll('.feature-card, .service-card, .news-card');
            if (!this.cards.length) return;
            
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMove(e, card));
                card.addEventListener('mouseleave', () => this.handleLeave(card));
            });
        }

        handleMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        }

        handleLeave(card) {
            card.style.transform = '';
        }
    }

    // ========================================
    // Typing Animation
    // ========================================
    class TypingAnimation {
        constructor() {
            this.elements = document.querySelectorAll('[data-typing]');
            if (!this.elements.length) return;
            
            this.init();
        }

        init() {
            this.elements.forEach(el => {
                const text = el.getAttribute('data-typing');
                const speed = parseInt(el.getAttribute('data-speed')) || 50;
                el.textContent = '';
                this.typeText(el, text, speed);
            });
        }

        typeText(element, text, speed) {
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            };
            type();
        }
    }

    // ========================================
    // Loading Animation
    // ========================================
    class LoadingAnimation {
        constructor() {
            this.loader = document.querySelector('.loader');
            if (!this.loader) return;
            
            this.init();
        }

        init() {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.loader.classList.add('loaded');
                    setTimeout(() => {
                        this.loader.style.display = 'none';
                    }, 500);
                }, 500);
            });
        }
    }

    // ========================================
    // Image Lazy Loading
    // ========================================
    class LazyLoad {
        constructor() {
            this.images = document.querySelectorAll('img[data-src]');
            if (!this.images.length) return;
            
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            this.images.forEach(img => observer.observe(img));
        }
    }

    // ========================================
    // Mobile App Showcase Interactions
    // ========================================
    class AppShowcase {
        constructor() {
            this.showcase = document.querySelector('.app-phone-stack');
            if (!this.showcase) return;
            
            this.init();
        }

        init() {
            const phones = this.showcase.querySelectorAll('.app-phone');
            
            phones.forEach(phone => {
                phone.addEventListener('mouseenter', () => {
                    phones.forEach(p => {
                        if (p !== phone) {
                            p.style.opacity = '0.6';
                        }
                    });
                });
                
                phone.addEventListener('mouseleave', () => {
                    phones.forEach(p => {
                        p.style.opacity = '1';
                    });
                });
            });
        }
    }

    // ========================================
    // Active Navigation Link
    // ========================================
    class ActiveNav {
        constructor() {
            this.links = document.querySelectorAll('.nav-link');
            this.currentPath = window.location.pathname.split('/').pop() || 'index.html';
            
            this.init();
        }

        init() {
            this.links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === this.currentPath || (this.currentPath === '' && href === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    }

    // ========================================
    // Back to Top Button
    // ========================================
    class BackToTop {
        constructor() {
            this.button = document.querySelector('.back-to-top');
            if (!this.button) return;
            
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            });
            
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ========================================
    // Cookie Consent
    // ========================================
    class CookieConsent {
        constructor() {
            this.cookieBanner = document.querySelector('.cookie-banner');
            if (!this.cookieBanner) return;
            
            this.init();
        }

        init() {
            if (!localStorage.getItem('cookiesAccepted')) {
                setTimeout(() => {
                    this.cookieBanner.classList.add('show');
                }, 2000);
            }
            
            const acceptBtn = this.cookieBanner.querySelector('.cookie-accept');
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    this.cookieBanner.classList.remove('show');
                });
            }
        }
    }

    // ========================================
    // Initialize All Components
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleAnimation();
        new Navigation();
        new ScrollAnimations();
        new CounterAnimation();
        new SmoothScroll();
        new FormHandler();
        new Card3DEffect();
        new AppShowcase();
        new ActiveNav();
        new BackToTop();
        new CookieConsent();
        
        console.log('Xintao Network Technology Co., Ltd. - Website Initialized');
    });

})();
