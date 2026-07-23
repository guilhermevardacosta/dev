document.addEventListener('DOMContentLoaded', () => {
    
    /* ====================================================================
       1. GESTÃO DE TEMA E ACESSIBILIDADE DAS IMAGENS
       ==================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;
    const heroImages = document.querySelectorAll('.hero-image-container img');

    // Função para atualizar a visibilidade e a semântica das imagens
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

    // Aplica o tema, salva a preferência e ajusta as imagens
    function applyTheme(theme) {
        const isLight = theme === 'light';
        
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(isLight ? 'light-theme' : 'dark-theme');
        
        localStorage.setItem('theme', theme);
        themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        
        updateImagesVisibility(theme, false);
    }

    // Inicialização do Tema
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    /* ====================================================================
       2. EFEITO DE OLHAR (HOVER) NAS FOTOS DO HERO
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
       3. ANIMAÇÕES PARALLAX NO SCROLL (HERO IMAGE)
       ==================================================================== */
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        // Otimização usando requestAnimationFrame para performance fluida de rendering
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                
                // Aplica efeito Parallax apenas em desktops para preservar performance mobile
                if (window.innerWidth > 768 && heroImageContainer) {
                    // Multiplicador sutil (0.12) evita saltos bruscos e gera profundidade premium
                    heroImageContainer.style.transform = `translateY(${scrollPosition * 0.12}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    /* ====================================================================
       4. SCROLL TRIGGER ANIMATION (INTERSECTION OBSERVER)
       ==================================================================== */
    const observerOptions = {
        root: null,          // Usa o viewport como referência
        rootMargin: '0px',
        threshold: 0.15      // Dispara quando 15% do elemento entra na tela
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Remove a observação após animar para garantir ganho de performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Mapeia e adiciona a classe de trigger dinamicamente nas seções estratégicas
    const elementsToAnimate = [
        '#solucoes h2', 
        '.grid-cards .card', 
        '#beneficios .beneficios-text', 
        '#modelos h2', 
        '#modelos .section-subtitle',
        '.portfolio-item', 
        '.contato-wrapper'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('reveal');
            
            // Adiciona atraso cascata automático para grids/listas
            if (selector === '.grid-cards .card' || selector === '.portfolio-item') {
                el.classList.add(`delay-${(index % 3) + 1}`);
            }
            
            revealObserver.observe(el);
        });
    });

    /* ====================================================================
       5. FORMULÁRIO DE CONTATO (WHATSAPP BUSINESS)
       ==================================================================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const myPhoneNumber = '5553991079395'; 
            const nameInput = document.getElementById('name').value.trim();
            const messageInput = document.getElementById('message').value.trim();

            if (!nameInput || !messageInput) {
                alert('Por favor, preencha os campos para que eu possa entender o seu negócio.');
                return;
            }

            const fullMessage = `Olá, Guilherme! Meu nome é ${nameInput}.\n\nEstou entrando em contato pelo seu site e gostaria de conversar sobre a criação de um site para o meu negócio.\n\nDetalhes que deixei no formulário:\n"${messageInput}"`;
            const encodedMessage = encodeURIComponent(fullMessage);
            const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            contactForm.reset();
        });
    }
});
