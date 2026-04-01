document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const body = document.body;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            body.classList.remove('is-loading');
            body.classList.add('loaded'); // Trigger hero reveal
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
        link.addEventListener('click', (e) => {
            if (!link.classList.contains('nav-work-trigger')) {
                closeMenu();
            } else {
                e.preventDefault();
                // Optionally scroll showcase or highlight it
            }
        });
    });


    // --- Work Showcase (inside Menu) ---
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const showcaseNavBtns = document.querySelectorAll('.showcase-nav button');
    const showcaseTitle = document.querySelector('.showcase-title');

    const showcaseData = [
        { title: 'Exquisite Gardens', cat: 'Featured Portfolio' },
        { title: 'Azure Concept', cat: 'Water Sculptures' },
        { title: 'The Modern Loft', cat: 'Architectural Details' }
    ];

    showcaseNavBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Update buttons
            showcaseNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update items
            showcaseItems.forEach(item => item.classList.remove('active'));
            showcaseItems[index].classList.add('active');

            // Update text
            showcaseTitle.style.opacity = '0';
            setTimeout(() => {
                showcaseTitle.innerText = showcaseData[index].title;
                showcaseTitle.style.opacity = '1';
            }, 300);
        });
    });


    // --- Intersection Observer (Scroll Reveal) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a stat value, start counting
                if (entry.target.classList.contains('stat-val')) {
                    startCounter(entry.target);
                    revealObserver.unobserve(entry.target); // Only count once
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal, .stat-val').forEach(el => {
        revealObserver.observe(el);
    });


    // --- Stats Counter ---
    function startCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
            current += Math.ceil(target / 100);
            if (current >= target) {
                el.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.innerText = current.toLocaleString();
            }
        }, 15);
    }


    // --- Parallax Effect Helper ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxImg = document.querySelector('.parallax-img');
        
        if (parallaxImg) {
            parallaxImg.style.transform = `scale(1.1) translateY(${scrolled * 0.1}px)`;
        }
    });

});
