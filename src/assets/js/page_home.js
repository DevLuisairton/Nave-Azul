// src/assets/js/pages/page_home.js
window.initHomePage = function() {
    console.log("Nave Azul: Inicializando interações da Página Inicial (Home)...");

    // Se você usa a biblioteca AOS para animações de scroll na home:
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
        // É importante chamar AOS.refresh() se o conteúdo da home for alterado dinamicamente
        // ou após a navegação SPA se os elementos já estiverem no DOM mas escondidos.
        // No modelo MPA, o AOS.init() na carga da página é suficiente.
    } else {
        // console.warn("Nave Azul: Biblioteca AOS não encontrada para animações da home.");
    }

    // Animação do astronauta (CSS já faz a flutuação, JS pode adicionar mais)
    const astronautContainer = document.getElementById('astronautContainer');
    if (astronautContainer) {
        // Exemplo: Adicionar uma classe após um delay para uma entrada mais dramática
        // setTimeout(() => {
        //     astronautContainer.classList.add('astronaut-entered');
        // }, 300); // Se tiver uma classe .astronaut-entered no CSS
    }

    // Lógica para os .action-card que agora são <a> e navegam para outras páginas HTML
    // Não precisam de JS para a navegação em si (o href faz isso).
    // Mas podem ter JS para efeitos visuais no clique, se desejado, ANTES da navegação.
    const actionCards = document.querySelectorAll('#homePage .action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Exemplo: Adicionar um efeito de "clique" antes de navegar
            // this.classList.add('clicked');
            // setTimeout(() => {
            //    // A navegação ocorrerá normalmente pelo href da tag <a>
            //    // Se fosse um <button> navegando via JS: window.location.href = this.dataset.href;
            // }, 150); // Pequeno delay para o efeito visual
            console.log(`Nave Azul: Action card '${this.querySelector('h3').textContent.trim()}' clicado. Navegando para: ${this.href}`);
        });
    });


    console.log("Nave Azul: Interações da Página Inicial carregadas.");
};