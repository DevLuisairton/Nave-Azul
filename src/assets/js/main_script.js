// src/assets/js/main.js (ou main_script.js)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Nave Azul: DOM principal carregado. Iniciando módulos...");

    // 1. Inicializa Header (Navbar, Partículas, Scroll Effect)
    if (typeof window.initHeader === 'function') {
        window.initHeader();
    } else {
        console.error("Nave Azul ERRO: initHeader não está definida. Verifique header.js");
    }

    // 2. Inicializa a Suíte de Acessibilidade Global (Painel + Leitor de Tela)
    if (typeof window.initAccessibilitySuite === 'function') { // Note o nome da função
        window.initAccessibilitySuite();
    } else {
        console.error("Nave Azul ERRO: initAccessibilitySuite não está definida. Verifique accessibility.js");
    }

    // 3. Inicializa o Footer Global
    if (typeof window.initFooter === 'function') {
        window.initFooter();
    } else {
        console.error("Nave Azul ERRO: initFooter não definida. Verifique footer.js");
    }

    // 4. Detecta a página atual e chama seu inicializador específico
    // Para index.html, assumimos que é a 'homePage'
    // Esta lógica de detecção pode ser mais robusta para MPA
    const bodyId = document.body.id; // Ex: <body id="homePageBody">

    // Se for index.html, a div principal da página deve ter id="homePage" e class="page active"
    const activePageDiv = document.querySelector('main > .page.active');

    if (activePageDiv && activePageDiv.id === 'homePage') {
        if (typeof window.initHomePage === 'function') {
            if (!activePageDiv.dataset.initialized) {
                console.log("Nave Azul: Inicializando lógica específica para initHomePage");
                window.initHomePage();
                activePageDiv.dataset.initialized = 'true';
            }
        } else {
            console.warn("Nave Azul: Função initHomePage não encontrada. Verifique pages/page_home.js");
        }
    } else if (bodyId === 'homePageBody') { // Outra forma de checar se é a home
         if (typeof window.initHomePage === 'function') {
            if (!body.dataset.initialized) {
                console.log("Nave Azul: Inicializando lógica específica para initHomePage (via body ID)");
                window.initHomePage();
                body.dataset.initialized = 'true';
            }
        } else {
            console.warn("Nave Azul: Função initHomePage não encontrada (via body ID). Verifique pages/page_home.js");
        }
    } else {
        // Se não for a homePage, e este main.js for compartilhado,
        // ele tentaria detectar outras páginas aqui ou não faria nada específico da página.
        // Para um MPA puro, o main.js em cada página poderia ser mais simples
        // ou esta lógica de detecção seria mais sofisticada.
        console.log("Nave Azul: Não é a página inicial, ou a página ativa não foi detectada corretamente para inicialização específica.");
    }

    console.log("Nave Azul: Inicialização principal concluída.");
});

