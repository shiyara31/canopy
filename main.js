document.addEventListener('DOMContentLoaded', () => {

    // --- Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        lerp: 0.1,
        smoothWheel: true,
        smoothTouch: false, // Keep native touch for mobile feel
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Modal Lenis (for Smooth Gallery Scroll) ---
    const projectModal = document.getElementById('project-modal');
    const modalLenis = new Lenis({
        wrapper: projectModal, 
        content: projectModal.querySelector('.modal-content'),
        duration: 1.5, // Slightly longer for more "luxury" feel
        lerp: 0.08, // More inertial and smooth
        smoothWheel: true,
    });

    function mRaf(time) {
        modalLenis.raf(time);
        requestAnimationFrame(mRaf);
    }
    requestAnimationFrame(mRaf);

    // --- Archive Lenis ---
    const archiveOverlay = document.getElementById('archive-overlay');
    const archiveLenis = new Lenis({
        wrapper: archiveOverlay,
        content: archiveOverlay.querySelector('.archive-content'),
        duration: 1.2,
        lerp: 0.1,
        smoothWheel: true,
    });

    function aRaf(time) {
        archiveLenis.raf(time);
        requestAnimationFrame(aRaf);
    }
    requestAnimationFrame(aRaf);

    window.addEventListener('resize', () => {
        lenis.resize();
        modalLenis.resize();
        archiveLenis.resize();
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
        lenis.stop(); // Stop scrolling when menu is open
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        lenis.start(); // Restart scroll
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
    const heroVisual = document.querySelector('.hero-visual img, .hero-visual video');
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
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    // --- Project Modal Logic ---
    const projectCards = document.querySelectorAll('.project-card');
    const modalClose = document.querySelector('.modal-close');
    const modalBg = document.querySelector('.modal-bg');

    function openProject(card) {
        const title = card.getAttribute('data-title');
        const category = card.getAttribute('data-category');
        const description = card.getAttribute('data-description');
        const images = card.getAttribute('data-images').split(',');

        // Populate Content
        projectModal.querySelector('.modal-title').innerText = title;
        projectModal.querySelector('.modal-category').innerText = category;
        projectModal.querySelector('.modal-description').innerText = description;

        // Populate Info Grid
        const infoGrid = projectModal.querySelector('.modal-info-grid');
        infoGrid.innerHTML = '';
        const client = card.getAttribute('data-client');
        const location = card.getAttribute('data-location');
        const area = card.getAttribute('data-area');
        const year = card.getAttribute('data-year') || '2026';

        if (client) infoGrid.innerHTML += `<div class="info-item"><span>Client</span><p>${client}</p></div>`;
        if (location) infoGrid.innerHTML += `<div class="info-item"><span>Location</span><p>${location}</p></div>`;
        if (category) infoGrid.innerHTML += `<div class="info-item"><span>Category</span><p>${category}</p></div>`;
        if (area) infoGrid.innerHTML += `<div class="info-item"><span>Area</span><p>${area}</p></div>`;
        if (!client && !location && !area) {
            infoGrid.innerHTML += `<div class="info-item"><span>Location</span><p>Global Consultancy</p></div>`;
            infoGrid.innerHTML += `<div class="info-item"><span>Year</span><p>${year}</p></div>`;
        }

        const gallery = projectModal.querySelector('.modal-gallery');
        gallery.innerHTML = ''; // Clear previous
        images.forEach((imgSrc, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${imgSrc}" alt="${title}" loading="lazy" 
                     onload="this.style.opacity='1'" 
                     style="opacity: 0; transition: opacity 0.8s ease;">
                <div class="gallery-overlay">
                    <i class="fa-solid fa-search"></i>
                </div>
            `;
            galleryItem.addEventListener('click', () => openLightbox(imgSrc));
            gallery.appendChild(galleryItem);
        });

        // Show Modal
        projectModal.classList.add('active');
        lenis.stop(); // Stop main page scroll
        
        // Refresh modal scroll context
        setTimeout(() => {
            modalLenis.resize();
            modalLenis.scrollTo(0, { immediate: true });
        }, 50);
    }

    function closeProject() {
        projectModal.classList.remove('active');
        lenis.start(); // Restart scroll
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => openProject(card));
    });

    modalClose.addEventListener('click', closeProject);
    modalBg.addEventListener('click', closeProject);

    // --- Full-Screen Lightbox Logic ---
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxBg = document.querySelector('.lightbox-bg');

    function openLightbox(src) {
        lightboxImg.src = src;
        galleryLightbox.classList.add('active');
    }

    function closeLightbox() {
        galleryLightbox.classList.remove('active');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBg.addEventListener('click', closeLightbox);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (galleryLightbox.classList.contains('active')) {
                closeLightbox();
            } else if (projectModal.classList.contains('active')) {
                closeProject();
            } else if (archiveOverlay.classList.contains('active')) {
                closeArchive();
            }
        }
    });

    // --- Archive Overlay Logic ---
    const viewAllBtn = document.getElementById('viewAllProjects');
    const closeArchiveBtn = document.querySelector('.close-archive');

    function openArchive() {
        archiveOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeArchive() {
        archiveOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (viewAllBtn) viewAllBtn.addEventListener('click', openArchive);
    if (closeArchiveBtn) closeArchiveBtn.addEventListener('click', closeArchive);

});
