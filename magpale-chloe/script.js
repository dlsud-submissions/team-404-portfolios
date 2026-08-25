document.addEventListener('DOMContentLoaded', () => {
    const ACTIVE_LINK_OFFSET = 180;
    const BACK_TO_TOP_THRESHOLD = 500;
    const SLIDE_INTERVAL_MS = 8000;
    const TYPING_SPEED_MS = 55;
    const DELETING_SPEED_MS = 30;
    const PAUSE_AFTER_TYPE_MS = 1400;
    const PAUSE_AFTER_DELETE_MS = 300;
    const TYPING_START_DELAY_MS = 600;
    const REVEAL_THRESHOLD = 0.16;
    const PROJECT_REVEAL_THRESHOLD = 0.12;
    const MIN_NAME_LENGTH = 2;
    const MIN_MESSAGE_LENGTH = 10;
    const HEADER_OFFSET = 110;
    const SCROLL_DURATION_MS = 650;
    const THEME_STORAGE_KEY = 'portfolio-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const backToTop = document.getElementById('back_to_top');
    const form = document.getElementById('contact_form');
    const formStatus = document.getElementById('form_status');
    const projectGrid = document.getElementById('project_grid');
    const sliderVideo = document.getElementById('slider_video');
    const prevSlide = document.getElementById('prev_slide');
    const nextSlide = document.getElementById('next_slide');
    const modal = document.getElementById('project_modal');
    const modalImage = document.getElementById('modal_image');
    const modalTitle = document.getElementById('modal_title');
    const modalDescription = document.getElementById('modal_description');
    const modalDetails = document.getElementById('modal_details');
    const closeModal = document.getElementById('close_modal');

    const projects = [
        {
            title: 'Chill Shooters Airsoft Gaming Center',
            image: 'asset/airsoft-pic.png',
            summary: 'A management system for Chill Shooters Airsoft Gaming Center.',
            description: 'This is our client\'s first project, a management system for their airsoft gaming center. It includes features for booking, inventory management, and customer tracking. The design focuses on a clean interface with intuitive navigation to enhance user experience.',
            tags: ['UI Design', 'Dashboard'],
            details: ['Tracks progress in a visual layout', 'Focuses on readable cards and icons', 'Built for quick updates and review'],
        },
        {
            title: 'CodeVault',
            image: 'asset/codevault-pic.jpg',
            summary: 'A website to store and download existing code snippets.',
            description: 'CodeVault is a web application that allows users to store, manage, and download code snippets. It features a user-friendly interface with categorization and search functionality, making it easy for developers to organize their code. The design emphasizes clarity and accessibility, ensuring that users can quickly find and utilize their stored code.',
            tags: ['Code', 'Storage', 'UI Design'],
            details: ['Uses warm tones and soft spacing', 'Highlights image-driven storytelling', 'Includes a lightbox-ready structure'],
        },
        {
            title: 'DLSU-D GPA Calculator',
            image: 'asset/dlsudcalc-pic.png',
            summary: 'A simple GPA calculator for DLSU-D students.',
            description: 'The DLSU-D GPA Calculator is a straightforward tool for students to compute their cumulative GPA based on their grades. It features a clean interface with easy-to-use input fields and real-time calculation updates.',
            tags: ['Calculator', 'Education'],
            details: ['Calculates cumulative GPA', 'Supports multiple subjects', 'Provides instant results'],
        },
    ];

    const sliderMedia = [
        { src: 'asset/airsoft-vid.mp4', title: 'Airsoft Project' },
        { src: 'asset/codevault-vid.mp4', title: 'CodeVault Project' },
        { src: 'asset/dlsudcalc-vid.mp4', title: 'DLSUD Calculator Project' },
    ];
    let slideIndex = 0;
    let slideInterval = null;

    const typingTarget = document.querySelector('.typing-line');
    const typingTexts = [
        'I build clean, responsive, and creative web experiences.',
        'Front-end developer',
        'Information Technology student',
        'Designer & Photographer',
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
        if (!typingTarget) return;

        const current = typingTexts[textIndex];

        if (!isDeleting) {
            charIndex++;
            typingTarget.textContent = current.slice(0, charIndex);

            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeLoop, PAUSE_AFTER_TYPE_MS);
            } else {
                setTimeout(typeLoop, TYPING_SPEED_MS + Math.random() * 30);
            }
            return;
        }

        charIndex--;
        typingTarget.textContent = current.slice(0, charIndex);

        if (!charIndex) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            setTimeout(typeLoop, PAUSE_AFTER_DELETE_MS);
        } else {
            setTimeout(typeLoop, DELETING_SPEED_MS);
        }
    };

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === THEME_DARK) {
        body.dataset.theme = THEME_DARK;
        themeToggle.setAttribute('aria-pressed', 'true');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else if (savedTheme === THEME_LIGHT) {
        delete body.dataset.theme;
        themeToggle.setAttribute('aria-pressed', 'false');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        delete body.dataset.theme;
        localStorage.setItem(THEME_STORAGE_KEY, THEME_LIGHT);
    }

    const renderProjects = () => {
        projectGrid.innerHTML = projects.map((project, index) => `
            <article class="card project-card reveal">
                <img class="project-image" src="${project.image}" alt="${project.title}">
                <div class="project-content">
                    <div>
                        <h3>${project.title}</h3>
                        <p>${project.summary}</p>
                    </div>
                    <div class="project-meta">
                        ${project.tags.map((tag) => `<span class="chip">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        <button class="link-button" type="button" data-project="${index}">View details</button>
                    </div>
                </div>
            </article>
        `).join('');
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: REVEAL_THRESHOLD });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: PROJECT_REVEAL_THRESHOLD });

    const syncRevealCards = () => {
        document.querySelectorAll('.project-card').forEach((card) => projectObserver.observe(card));
    };

    const setActiveLink = () => {
        let current = sections[0]?.id || '';

        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - ACTIVE_LINK_OFFSET) {
                current = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    const showSlide = (nextIndex) => {
        slideIndex = (nextIndex + sliderMedia.length) % sliderMedia.length;
        const media = sliderMedia[slideIndex];
        if (!sliderVideo) return;

        sliderVideo.src = media.src;
        sliderVideo.title = media.title;
        sliderVideo.loop = true;
        sliderVideo.muted = true;
        sliderVideo.load();
        sliderVideo.play().catch((error) => {
            console.error('Video autoplay blocked:', error);
        });
    };

    const startAutoSlides = () => {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(() => {
            showSlide(slideIndex + 1);
        }, SLIDE_INTERVAL_MS);
    };

    const resetAutoSlides = (nextIndex) => {
        showSlide(nextIndex);
        startAutoSlides();
    };

    const openModal = (projectIndex) => {
        const project = projects[projectIndex];
        modalImage.src = project.image;
        modalImage.alt = project.title;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description || project.summary;
        modalDetails.innerHTML = project.details.map((detail) => `<li>${detail}</li>`).join('');
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeProjectModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    };

    const easeInOutCubic = (progress) => (
        progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - ((-2 * progress + 2) ** 3) / 2
    );

    const animateScrollTo = (targetPosition) => {
        if (prefersReducedMotion) {
            window.scrollTo(0, targetPosition);
            return;
        }

        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
            window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    const scrollToTop = () => {
        animateScrollTo(0);
    };

    const scrollToSection = (targetId) => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        animateScrollTo(targetPosition);
    };

    // ─── Attach all event listeners FIRST, so a later init error can't skip them ───

    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToTop();
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            navMenu.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

            scrollToSection(link.getAttribute('href').slice(1));
        });
    });

    document.querySelectorAll('.hero-actions a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToSection(link.getAttribute('href').slice(1));
        });
    });

    themeToggle.addEventListener('click', () => {
        const isDark = body.dataset.theme === THEME_DARK;

        if (isDark) {
            delete body.dataset.theme;
            themeToggle.setAttribute('aria-pressed', 'false');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem(THEME_STORAGE_KEY, THEME_LIGHT);
            return;
        }

        body.dataset.theme = THEME_DARK;
        themeToggle.setAttribute('aria-pressed', 'true');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem(THEME_STORAGE_KEY, THEME_DARK);
    });

    prevSlide.addEventListener('click', () => resetAutoSlides(slideIndex - 1));
    nextSlide.addEventListener('click', () => resetAutoSlides(slideIndex + 1));

    projectGrid.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-project]');
        if (!trigger) return;

        openModal(Number(trigger.dataset.project));
    });

    closeModal.addEventListener('click', closeProjectModal);

    modal.addEventListener('click', (event) => {
        if (event.target !== modal) return;

        closeProjectModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;

        closeProjectModal();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const nameError = document.getElementById('name_error');
        const emailError = document.getElementById('email_error');
        const messageError = document.getElementById('message_error');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;

        [nameError, emailError, messageError].forEach((element) => {
            element.textContent = '';
        });
        formStatus.textContent = '';
        formStatus.classList.remove('is-error', 'is-success');

        if (name.value.trim().length < MIN_NAME_LENGTH) {
            nameError.textContent = 'Please enter your full name.';
            isValid = false;
        }

        if (!emailPattern.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        if (message.value.trim().length < MIN_MESSAGE_LENGTH) {
            messageError.textContent = 'Please write at least 10 characters.';
            isValid = false;
        }

        if (!isValid) {
            formStatus.textContent = 'Please fix the highlighted fields.';
            formStatus.classList.add('is-error');
            return;
        }

        form.reset();
        formStatus.textContent = 'Message sent successfully. I will get back to you soon.';
        formStatus.classList.add('is-success');
    });

    window.addEventListener('scroll', () => {
        setActiveLink();
        backToTop.classList.toggle('visible', window.scrollY > BACK_TO_TOP_THRESHOLD);
    }, { passive: true });

    backToTop.addEventListener('click', scrollToTop);


    try { renderProjects(); } catch (e) { console.error('renderProjects failed:', e); }
    try { syncRevealCards(); } catch (e) { console.error('syncRevealCards failed:', e); }
    try { showSlide(0); } catch (e) { console.error('showSlide failed:', e); }
    try { startAutoSlides(); } catch (e) { console.error('startAutoSlides failed:', e); }
    setTimeout(typeLoop, TYPING_START_DELAY_MS);
    try { setActiveLink(); } catch (e) { console.error('setActiveLink failed:', e); }
});