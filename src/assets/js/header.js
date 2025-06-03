// src/assets/js/header.js
window.initHeader = function() {
    console.log("Nave Azul: Inicializando Header/Navbar UI...");

    // --- Menu de Navegação Mobile (Hamburger) ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active'); // Para animar o ícone do hamburger para 'X'
            navToggle.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
                document.body.classList.add('no-scroll-mobile-menu');
            } else {
                navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
                document.body.classList.remove('no-scroll-mobile-menu');
            }
        });

        // Função global para fechar o menu mobile (pode ser chamada por outros scripts)
        window.closeMobileMenu = function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
                document.body.classList.remove('no-scroll-mobile-menu');
            }
        };

        // Fechar menu ao clicar em um link DENTRO dele (para navegação MPA ou SPA)
        navMenu.querySelectorAll('a.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    window.closeMobileMenu();
                }
            });
        });

    } else {
        console.warn("Nave Azul: Elementos do menu mobile (navToggle ou navLinks) não encontrados.");
    }

    // --- Navbar Scroll Effect ---
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        let lastScrollTop = 0;
        const navHeightInitial = mainNav.offsetHeight; // Altura inicial da navbar

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 30) { // Distância para ativar o efeito .scrolled
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }

            // Efeito auto-hide (esconder ao rolar para baixo, mostrar ao rolar para cima)
            // Requer CSS para .nav-hidden-on-scroll { transform: translateY(-100%); }
            // e transition no .main-nav para transform.
            /*
            if (scrollTop > lastScrollTop && scrollTop > navHeightInitial * 1.5) {
                mainNav.classList.add('nav-hidden-on-scroll');
            } else {
                if (scrollTop + window.innerHeight < document.documentElement.scrollHeight - 50 || scrollTop < lastScrollTop) {
                    mainNav.classList.remove('nav-hidden-on-scroll');
                }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            */
        }, { passive: true });
    } else {
        console.warn("Nave Azul: Elemento mainNav não encontrado para efeito de scroll.");
    }
    console.log("Nave Azul: Header/Navbar UI inicializado.");
};