// src/assets/js/header.js
window.initHeader = function() {
    console.log("Nave Azul: Inicializando Header (Navbar, Partículas)...");

    // --- Menu de Navegação Mobile (Hamburger) ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
                document.body.classList.add('no-scroll-mobile-menu');
            } else {
                navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
                document.body.classList.remove('no-scroll-mobile-menu');
            }
        });

        // Função para fechar o menu (pode ser chamada por outros scripts se necessário)
        window.closeMobileMenu = function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
                document.body.classList.remove('no-scroll-mobile-menu');
            }
        };

        // Fechar menu ao clicar em um link dentro dele (para MPA, a página recarrega de qualquer forma)
        navMenu.querySelectorAll('a.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    // Não é estritamente necessário para MPA, mas não prejudica
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
        const navHeightInitial = mainNav.offsetHeight;

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 30) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
            // Lógica auto-hide opcional removida para simplificar, pode ser adicionada se desejado
            // lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    } else {
        console.warn("Nave Azul: Elemento mainNav não encontrado para efeito de scroll.");
    }

    // --- Partículas de Fundo (Estrelas) ---
    const particlesContainer = document.getElementById('backgroundParticles'); // Assumindo que este ID existe no seu HTML base
    if (particlesContainer) {
        const numParticles = 70;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            if (particlesContainer.children.length < numParticles) {
                for (let i = 0; i < numParticles; i++) {
                    let particle = document.createElement('div');
                    particle.classList.add('particle');
                    particle.style.setProperty('--random-x', (Math.random() * 200 - 100).toFixed(2));
                    particle.style.setProperty('--random-y-start', (Math.random() * 100).toFixed(2));
                    particle.style.setProperty('--random-scale', (Math.random() * 0.7 + 0.1).toFixed(2));
                    particle.style.setProperty('--random-opacity', (Math.random() * 0.6 + 0.2).toFixed(2));
                    particle.style.left = `${Math.random() * 100}%`;
                    const size = Math.random() * 1.5 + 0.5;
                    particle.style.width = `${size}px`;
                    particle.style.height = particle.style.width;
                    particle.style.animationDelay = `${Math.random() * 30}s`;
                    particle.style.animationDuration = `${Math.random() * 100 + 60}s`;
                    particlesContainer.appendChild(particle);
                }
            }
        } else {
            while (particlesContainer.firstChild) {
                particlesContainer.removeChild(particlesContainer.firstChild);
            }
        }
    } else {
         // console.warn("Nave Azul: Container de partículas 'backgroundParticles' não encontrado.");
    }

    console.log("Nave Azul: Header UI inicializado.");
};