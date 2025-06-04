// src/assets/js/pages/page_home.js
window.initHomePage = function() {
    console.log("Nave Azul: Inicializando interações da Página Inicial (Home)...");

    // Se você ainda usa AOS nesta página:
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
        // Se a home tiver conteúdo carregado dinamicamente que precisa do AOS após a carga inicial,
        // você pode precisar chamar AOS.refresh() aqui ou após essas cargas.
        // Para um MPA simples, AOS.init() na carga da página é geralmente suficiente.
    } else {
        // console.warn("Nave Azul: Biblioteca AOS não encontrada para animações da home page.");
    }

    // Lógica do astronauta já está no CSS (animação floatAstronaut)
    // e a entrada com fadeInAstronaut também está no CSS.
    // Se precisar de interações JS mais complexas com o astronauta, adicione aqui.

    // Os .action-card agora são <a> com href, não precisam de JS para navegação básica.
    // Se quiser adicionar efeitos JS no clique ANTES de navegar:
    const actionCards = document.querySelectorAll('#homePage .action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Exemplo: adicionar uma classe para um feedback visual rápido
            // this.classList.add('action-card-clicked');
            // setTimeout(() => this.classList.remove('action-card-clicked'), 300);
            // A navegação para o href ocorrerá naturalmente.
            console.log(`Nave Azul: Card de ação '${this.querySelector('h3').textContent.trim()}' clicado, navegando para ${this.href}`);
        });
    });

    console.log("Nave Azul: Interações da Página Inicial carregadas.");
};