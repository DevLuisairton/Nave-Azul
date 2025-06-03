// src/assets/js/pages/page_sobre.js
window.initSobrePage = function() {
    console.log("Nave Azul: Inicializando interações da Página Sobre...");

    // Exemplo: Animação de entrada para os team cards
    const teamCards = document.querySelectorAll('#sobrePage .team-card');
    teamCards.forEach((card, index) => {
        // card.style.animationDelay = `${index * 0.1}s`;
        // card.classList.add('animate-on-load');
    });

    console.log("Nave Azul: Interações da Página Sobre carregadas.");
};