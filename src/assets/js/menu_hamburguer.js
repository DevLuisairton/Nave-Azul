// Controle do menu hambúrguer
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
  
  // Alterna estado do menu
  hamburger.setAttribute('aria-expanded', !isExpanded);
  navMenu?.setAttribute('aria-expanded', !isExpanded);
  
  // Atualiza classes para animação
  hamburger.classList.toggle('active');
  navMenu?.classList.toggle('active');

  // Foca no primeiro item do menu quando aberto
  if (!isExpanded) {
    setTimeout(() => {
      const firstMenuItem = navMenu?.querySelector('.nav-link');
      firstMenuItem?.focus();
    }, 100); // Pequeno delay para garantir que o menu está visível
  }
});

// Fecha menu ao clicar em um item (mobile)
navMenu?.addEventListener('click', (e) => {
  if (e.target.closest('.nav-link')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-expanded', 'false');
  }
});

// Fecha menu ao pressionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

// Fecha menu ao clicar fora (overlay)
document.addEventListener('click', (e) => {
  if (navMenu?.classList.contains('active') && 
      !e.target.closest('.nav-container') &&
      !e.target.closest('.hamburger')) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-expanded', 'false');
  }
});

// Atualiza estado dos links de navegação
function updateActiveLinks() {
  const currentPath = window.location.hash || '#inicio';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks?.forEach(link => {
    const linkPath = link.getAttribute('href');
    const isActive = linkPath === currentPath;
    link.setAttribute('data-active', isActive);
    
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Observa mudanças na URL
window.addEventListener('hashchange', updateActiveLinks);
window.addEventListener('load', updateActiveLinks);