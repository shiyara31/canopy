document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .menu-trigger');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(4)';
            follower.style.transform = 'scale(1.5)';
            follower.style.borderColor = 'rgba(191, 161, 111, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.borderColor = 'rgba(191, 161, 111, 0.5)';
        });
    });

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const body = document.body;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            body.classList.remove('is-loading');
            body.classList.add('loaded');
        }, 1500);
    });

    // --- Menu Overlay Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeOverlay = document.querySelector('.close-overlay');
    const navLinks = document.querySelectorAll('.nav-list a');

    function openMenu() {
        menuOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        body.style.overflow = 'auto';
    }

    menuToggle.addEventListener('click', openMenu);
    closeOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // --- Intersection Observer (Scroll Reveal) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a stat value, start counting
                if (entry.target.classList.contains('stat-val')) {
                    startCounter(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal, .stat-val').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Stats Counter ---
    function startCounter(el) {
        const targetStr = el.getAttribute('data-target');
        const target = parseFloat(targetStr);
        const isFloat = targetStr.includes('.');
        let current = 0;
        const duration = 2500;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = isFloat ? target.toFixed(1) : Math.floor(target).toLocaleString();
                clearInterval(timer);
            } else {
                el.innerText = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
            }
        }, stepTime);
    }

    // --- Testimonials Slider ---
    const testiItems = document.querySelectorAll('.testi-item');
    const testiPrev = document.querySelector('.testi-prev');
    const testiNext = document.querySelector('.testi-next');
    let currentTesti = 0;

    if (testiItems.length > 0 && testiNext && testiPrev) {
        console.log('Slider initialized with', testiItems.length, 'items');
        
        function showTesti(index) {
            testiItems.forEach((item, i) => {
                item.classList.remove('active');
                if (i === index) {
                    item.classList.add('active');
                }
            });
        }

        testiNext.addEventListener('click', (e) => {
            e.preventDefault();
            currentTesti = (currentTesti + 1) % testiItems.length;
            showTesti(currentTesti);
        });

        testiPrev.addEventListener('click', (e) => {
            e.preventDefault();
            currentTesti = (currentTesti - 1 + testiItems.length) % testiItems.length;
            showTesti(currentTesti);
        });
    }

    // --- Mouse Parallax for Hero ---
    const heroVisual = document.querySelector('.hero-visual img');
    if (heroVisual) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 40;
            const y = (window.innerHeight / 2 - e.clientY) / 40;
            heroVisual.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
        });
    }

    // --- Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

});
