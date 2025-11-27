/**
 * Fluent Design Reveal Effect
 * Implements Microsoft-style mouse tracking reveal effects
 */

class FluentReveal {
    constructor() {
        this.initRevealElements();
        this.initMouseTracking();
        this.initStaggerAnimations();
    }

    /**
     * Initialize reveal effect on all interactive elements
     */
    initRevealElements() {
        const revealElements = document.querySelectorAll('.btn, .card, .stat-card, .nav-link, .chart-wrapper');

        revealElements.forEach(el => {
            el.classList.add('reveal-effect');

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                el.style.setProperty('--mouse-x', `${x}%`);
                el.style.setProperty('--mouse-y', `${y}%`);
            });

            el.addEventListener('mouseleave', () => {
                el.style.setProperty('--mouse-x', '50%');
                el.style.setProperty('--mouse-y', '50%');
            });
        });
    }

    /**
     * Track mouse position globally for header reveal
     */
    initMouseTracking() {
        const header = document.querySelector('.header');
        if (!header) return;

        document.addEventListener('mousemove', (e) => {
            const rect = header.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            header.style.setProperty('--mouse-x', `${x}%`);
            header.style.setProperty('--mouse-y', `${y}%`);
        });
    }

    /**
     * Add stagger animations to grid items
     */
    initStaggerAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('stagger-item');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe grid items, stat cards, and chart wrappers
        const items = document.querySelectorAll('.grid > *, .stat-card, .chart-wrapper');
        items.forEach((item, index) => {
            item.style.setProperty('--stagger-index', index);
            observer.observe(item);
        });
    }

    /**
     * Add parallax effect to hero section
     */
    initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;

            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    /**
     * Add smooth reveal on scroll
     */
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('section, .chart-wrapper, .card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FluentReveal();
    });
} else {
    new FluentReveal();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FluentReveal;
}
