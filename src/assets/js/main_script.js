// src/assets/js/main.js (ou main_script.js)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Nave Azul: DOM completamente carregado. Iniciando scripts principais...");

    // 1. Inicializa Componentes de UI Globais (Navbar, Partículas, etc.)
    if (typeof window.initComponentsUI === 'function') {
        window.initComponentsUI();
    } else {
        console.error("Nave Azul ERRO: initComponentsUI não está definida. Verifique components_ui.js");
    }

    // 2. Inicializa o Handler de Acessibilidade Global
    if (typeof window.initAccessibility === 'function') {
        window.initAccessibility();
    } else {
        console.error("Nave Azul ERRO: initAccessibility não está definida. Verifique accessibility_handler.js");
    }

    // 3. Inicializa o Leitor de Tela Global
    if (typeof window.initScreenReader === 'function') {
        window.initScreenReader();
    } else {
        console.error("Nave Azul ERRO: initScreenReader não está definida. Verifique screen_reader.js");
    }

    // 4. Detecta a página atual e chama seu inicializador específico
    //    Vamos usar o ID do elemento com a classe '.page.active' ou um ID no body.
    //    No seu HTML, cada página principal (a div com class="page") tem um ID.
    const activePageElement = document.querySelector('main > .page.active'); // Procura dentro do <main>
    let currentPageId = null;

    if (activePageElement && activePageElement.id) {
        currentPageId = activePageElement.id;
        console.log(`Nave Azul: Página ativa detectada: ${currentPageId}`);

        const initFunctionName = `init${currentPageId.charAt(0).toUpperCase() + currentPageId.slice(1)}`; // Ex: initHomePage, initTeaPage

        if (typeof window[initFunctionName] === 'function') {
            if (!activePageElement.dataset.initialized) { // Evita re-inicializar se já foi
                console.log(`Nave Azul: Inicializando lógica específica para ${initFunctionName}`);
                window[initFunctionName]();
                activePageElement.dataset.initialized = 'true';
            }
        } else {
            console.warn(`Nave Azul: Função de inicialização ${initFunctionName} não encontrada para a página <span class="math-inline">\{currentPageId\}\. Verifique o script pages/</span>{currentPageId}.js`);
        }
    } else {
        // Fallback se não encontrar uma página ativa com ID (ex: se for uma página sem a estrutura .page)
        // Para o index.html, se a div principal tiver id="homePage"
        const bodyId = document.body.id;
        if (bodyId && bodyId.endsWith('Page')) { // Convenção: body com id tipo 'homePageBody' ou 'teaPageBody'
             currentPageId = bodyId.replace('Body', ''); // Remove 'Body' do final se existir
             const initFunctionName = `init${currentPageId.charAt(0).toUpperCase() + currentPageId.slice(1)}`;
             if (typeof window[initFunctionName] === 'function') {
                console.log(`Nave Azul: Inicializando lógica específica para ${initFunctionName} (detectado pelo body ID)`);
                window[initFunctionName]();
             }
        } else {
            console.warn("Nave Azul: Não foi possível detectar a página atual para inicializar scripts específicos de página.");
        }
    }


    // 5. Lógica Comum do Footer (Ano Atual)
    const currentYearSpan =// src/assets/js/main.js (ou main_script.js)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Nave Azul: DOM completamente carregado. Iniciando scripts principais...");

    // 1. Inicializa Componentes de UI Globais (Navbar, Partículas, etc.)
    if (typeof window.initComponentsUI === 'function') {
        window.initComponentsUI();
    } else {
        console.error("Nave Azul ERRO: initComponentsUI não está definida. Verifique components_ui.js");
    }

    // 2. Inicializa o Handler de Acessibilidade Global
    if (typeof window.initAccessibility === 'function') {
        window.initAccessibility();
    } else {
        console.error("Nave Azul ERRO: initAccessibility não está definida. Verifique accessibility_handler.js");
    }

    // 3. Inicializa o Leitor de Tela Global
    if (typeof window.initScreenReader === 'function') {
        window.initScreenReader();
    } else {
        console.error("Nave Azul ERRO: initScreenReader não está definida. Verifique screen_reader.js");
    }

    // 4. Detecta a página atual e chama seu inicializador específico
    //    Vamos usar o ID do elemento com a classe '.page.active' ou um ID no body.
    //    No seu HTML, cada página principal (a div com class="page") tem um ID.
    const activePageElement = document.querySelector('main > .page.active'); // Procura dentro do <main>
    let currentPageId = null;

    if (activePageElement && activePageElement.id) {
        currentPageId = activePageElement.id;
        console.log(`Nave Azul: Página ativa detectada: ${currentPageId}`);

        const initFunctionName = `init${currentPageId.charAt(0).toUpperCase() + currentPageId.slice(1)}`; // Ex: initHomePage, initTeaPage

        if (typeof window[initFunctionName] === 'function') {
            if (!activePageElement.dataset.initialized) { // Evita re-inicializar se já foi
                console.log(`Nave Azul: Inicializando lógica específica para ${initFunctionName}`);
                window[initFunctionName]();
                activePageElement.dataset.initialized = 'true';
            }
        } else {
            console.warn(`Nave Azul: Função de inicialização ${initFunctionName} não encontrada para a página <span class="math-inline">\{currentPageId\}\. Verifique o script pages/</span>{currentPageId}.js`);
        }
    } else {
        // Fallback se não encontrar uma página ativa com ID (ex: se for uma página sem a estrutura .page)
        // Para o index.html, se a div principal tiver id="homePage"
        const bodyId = document.body.id;
        if (bodyId && bodyId.endsWith('Page')) { // Convenção: body com id tipo 'homePageBody' ou 'teaPageBody'
             currentPageId = bodyId.replace('Body', ''); // Remove 'Body' do final se existir
             const initFunctionName = `init${currentPageId.charAt(0).toUpperCase() + currentPageId.slice(1)}`;
             if (typeof window[initFunctionName] === 'function') {
                console.log(`Nave Azul: Inicializando lógica específica para ${initFunctionName} (detectado pelo body ID)`);
                window[initFunctionName]();
             }
        } else {
            console.warn("Nave Azul: Não foi possível detectar a página atual para inicializar scripts específicos de página.");
        }
    }


    // 5. Lógica Comum do Footer (Ano Atual)
    const currentYearSpan =