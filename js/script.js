document.addEventListener('DOMContentLoaded', () => {
    
    /* ====================================================================
       1. GESTÃO DE TEMA E IMAGENS DO HERO
       ==================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const body = document.body;
    const heroImages = document.querySelectorAll('.frame-content img');

    function updateImagesVisibility(theme, isHovered = false) {
        heroImages.forEach(img => {
            const isCorrectTheme = img.getAttribute('data-theme') === theme;
            const isFrontImage = img.classList.contains('hero-img-front');
            const isSideImage = img.classList.contains('hero-img-side');

            let shouldBeVisible = false;
            if (isCorrectTheme) {
                if (isHovered && isSideImage) shouldBeVisible = true;
                if (!isHovered && isFrontImage) shouldBeVisible = true;
            }

            if (shouldBeVisible) {
                img.classList.add('active');
                img.setAttribute('aria-hidden', 'false');
            } else {
                img.classList.remove('active');
                img.setAttribute('aria-hidden', 'true');
            }
        });
    }

    function applyTheme(theme) {
        const isLight = theme === 'light';
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(isLight ? 'light-theme' : 'dark-theme');
        localStorage.setItem('theme', theme);
        if (themeIcon) themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        updateImagesVisibility(theme, false);
    }

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    /* ====================================================================
       2. HOVER NA MOLDURA DO HERO
       ==================================================================== */
    const heroImageContainer = document.querySelector('.hero-image-container');
    const isHoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (heroImageContainer && isHoverSupported) {
        heroImageContainer.addEventListener('mouseenter', () => {
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            updateImagesVisibility(currentTheme, true);
        });

        heroImageContainer.addEventListener('mouseleave', () => {
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            updateImagesVisibility(currentTheme, false);
        });
    }

    /* ====================================================================
       3. REVEAL ANIMATIONS ON SCROLL (INTERSECTION OBSERVER)
       ==================================================================== */
    const observerOptions = {
        root: null,
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ====================================================================
       4. PARALLAX SUAVE NO HERO
       ==================================================================== */
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.innerWidth > 768 && heroImageContainer) {
                    heroImageContainer.style.transform = `translateY(${window.scrollY * 0.08}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    /* ====================================================================
       5. FORMULÁRIO COM DIRECIONAMENTO PARA WHATSAPP
       ==================================================================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const myPhoneNumber = '5553991079395'; 
            const nameInput = document.getElementById('name').value.trim();
            const messageInput = document.getElementById('message').value.trim();

            if (!nameInput || !messageInput) {
                alert('Por favor, preencha os campos para continuarmos o atendimento.');
                return;
            }

            const fullMessage = `Olá, Guilherme! Meu nome é *${nameInput}*.\n\nEstou entrando em contato através do seu site para solicitar um orçamento de site profissional.\n\n*Detalhes do meu projeto:*\n"${messageInput}"`;
            const encodedMessage = encodeURIComponent(fullMessage);
            window.open(`https://wa.me/${myPhoneNumber}?text=${encodedMessage}`, '_blank');
            contactForm.reset();
        });
    }
});