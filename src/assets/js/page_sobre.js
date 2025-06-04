// src/assets/js/pages/page_sobre.js
window.initSobrePage = function() {
    console.log("Nave Azul: Inicializando interações da Página Sobre...");

    // Exemplo: Animação de entrada para os cards da equipe
    const teamCards = document.querySelectorAll('#sobrePage .team-card, #sobrePage .content-module');
     if (teamCards.length > 0 && typeof AOS === 'undefined') {
        teamCards.forEach((card, index) => {
            // card.style.setProperty('--section-delay', index);
            // card.classList.add('animate-on-scroll-sobre');
        });
    }
    console.log("Nave Azul: Interações da Página Sobre carregadas.");
};