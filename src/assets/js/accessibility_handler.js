// src/assets/js/accessibility.js

window.initAccessibilitySuite = function() {
    console.log("Nave Azul: Inicializando Suíte de Acessibilidade Completa...");

    // --- PARTE DO ACCESSIBILITY_HANDLER.JS ---
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    // openAccessibilityFromFooter é tratado em footer.js ou main.js

    const decreaseFontBtn = document.getElementById('decreaseFont');
    const increaseFontBtn = document.getElementById('increaseFont');
    const toggleContrastBtn = document.getElementById('toggleContrast');
    const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
    const toggleDyslexicFontBtn = document.getElementById('toggleDyslexicFont');
    const toggleLargeCursorBtn = document.getElementById('toggleLargeCursor');
    const toggleReadingGuideBtn = document.getElementById('toggleReadingGuide');
    const readingGuideElement = document.getElementById('readingGuide');
    const toggleHighlightLinksBtn = document.getElementById('toggleHighlightLinks');
    const resetSettingsBtn = document.getElementById('resetSettings');

    const body = document.body;
    const ACCESSIBILITY_STORAGE_KEY = 'naveAzulAccessibilitySettings';

    const defaultAccessibilitySettings = { // Renomeado para evitar conflito com defaultSettings do screen_reader
        fontSize: 16,
        highContrast: false,
        darkMode: false,
        dyslexicFont: false,
        largeCursor: false,
        readingGuide: false,
        highlightLinks: false,
    };

    let currentAccessibilityState = { ...defaultAccessibilitySettings };

    function applyAccessibilitySettings() {
        document.documentElement.style.fontSize = `${currentAccessibilityState.fontSize}px`;
        body.classList.toggle('high-contrast', currentAccessibilityState.highContrast);
        if(toggleContrastBtn) {
            toggleContrastBtn.textContent = currentAccessibilityState.highContrast ? 'Desativar' : 'Ativar';
            toggleContrastBtn.setAttribute('aria-pressed', currentAccessibilityState.highContrast);
        }
        body.classList.toggle('dark-mode-explicit', currentAccessibilityState.darkMode);
        if(toggleDarkModeBtn) {
            toggleDarkModeBtn.textContent = currentAccessibilityState.darkMode ? 'Desativar' : 'Ativar';
            toggleDarkModeBtn.setAttribute('aria-pressed', currentAccessibilityState.darkMode);
        }
        body.classList.toggle('dyslexic-font', currentAccessibilityState.dyslexicFont);
        if(toggleDyslexicFontBtn) {
            toggleDyslexicFontBtn.textContent = currentAccessibilityState.dyslexicFont ? 'Desativar' : 'Ativar';
            toggleDyslexicFontBtn.setAttribute('aria-pressed', currentAccessibilityState.dyslexicFont);
        }
        body.classList.toggle('large-cursor', currentAccessibilityState.largeCursor);
        if(toggleLargeCursorBtn) {
            toggleLargeCursorBtn.textContent = currentAccessibilityState.largeCursor ? 'Desativar' : 'Ativar';
            toggleLargeCursorBtn.setAttribute('aria-pressed', currentAccessibilityState.largeCursor);
        }
        if (readingGuideElement) readingGuideElement.classList.toggle('active', currentAccessibilityState.readingGuide);
        if(toggleReadingGuideBtn) {
            toggleReadingGuideBtn.textContent = currentAccessibilityState.readingGuide ? 'Desativar' : 'Ativar';
            toggleReadingGuideBtn.setAttribute('aria-pressed', currentAccessibilityState.readingGuide);
        }
        body.classList.toggle('highlight-links', currentAccessibilityState.highlightLinks);
        if(toggleHighlightLinksBtn) {
            toggleHighlightLinksBtn.textContent = currentAccessibilityState.highlightLinks ? 'Desativar' : 'Ativar';
            toggleHighlightLinksBtn.setAttribute('aria-pressed', currentAccessibilityState.highlightLinks);
        }
    }

    function saveAccessibilitySettings() {
        // Mescla com configurações existentes para não sobrescrever o estado do leitor de tela
        const existingSettings = JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) || '{}');
        const settingsToSave = { ...existingSettings, ...currentAccessibilityState };
        localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settingsToSave));
    }

    function loadAccessibilitySettings() {
        const savedSettings = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                currentAccessibilityState = { ...defaultAccessibilitySettings, ...parsedSettings };
            } catch (e) {
                console.error("Nave Azul: Erro ao carregar config de acessibilidade.", e);
                currentAccessibilityState = { ...defaultAccessibilitySettings };
            }
        }
        applyAccessibilitySettings();
    }

    window.announceAccessibilityChange = function(message) {
        let announcer = document.getElementById('accessibility-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'accessibility-announcer';
            announcer.setAttribute('aria-live', 'assertive');
            announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;';
            document.body.appendChild(announcer);
        }
        announcer.textContent = '';
        setTimeout(() => { announcer.textContent = message; }, 150); // Aumentado delay para mais confiabilidade

        if (window.isScreenReaderActive && window.speechSynth && typeof window.speakFromReader === 'function') {
            window.speakFromReader(message, true);
        }
    };

    if (accessibilityToggle && accessibilityPanel) {
        accessibilityToggle.addEventListener('click', () => {
            const isActive = accessibilityPanel.classList.toggle('active');
            accessibilityToggle.setAttribute('aria-expanded', isActive);
            accessibilityPanel.setAttribute('aria-hidden', !isActive);
            if (isActive) {
                accessibilityPanel.querySelector('button:not([disabled])')?.focus();
                window.announceAccessibilityChange('Painel de acessibilidade aberto.');
            } else {
                window.announceAccessibilityChange('Painel de acessibilidade fechado.');
            }
        });
    } else {
        console.warn("Nave Azul: Botão de toggle de acessibilidade ou painel não encontrado.");
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accessibilityPanel && accessibilityPanel.classList.contains('active')) {
            accessibilityPanel.classList.remove('active');
            if (accessibilityToggle) {
                accessibilityToggle.setAttribute('aria-expanded', 'false');
                accessibilityToggle.focus();
            }
            accessibilityPanel.setAttribute('aria-hidden', 'true');
            window.announceAccessibilityChange('Painel de acessibilidade fechado.');
        }
    });

    if (decreaseFontBtn) decreaseFontBtn.addEventListener('click', () => {
        if (currentAccessibilityState.fontSize > 10) {
            currentAccessibilityState.fontSize -= 1;
            applyAccessibilitySettings(); saveAccessibilitySettings();
            window.announceAccessibilityChange(`Tamanho da fonte ${currentAccessibilityState.fontSize} pixels.`);
        }
    });
    if (increaseFontBtn) increaseFontBtn.addEventListener('click', () => {
        if (currentAccessibilityState.fontSize < 28) {
            currentAccessibilityState.fontSize += 1;
            applyAccessibilitySettings(); saveAccessibilitySettings();
            window.announceAccessibilityChange(`Tamanho da fonte ${currentAccessibilityState.fontSize} pixels.`);
        }
    });

    [
        { btn: toggleContrastBtn, key: 'highContrast', name: 'Alto contraste' },
        { btn: toggleDarkModeBtn, key: 'darkMode', name: 'Modo escuro explícito' },
        { btn: toggleDyslexicFontBtn, key: 'dyslexicFont', name: 'Fonte para dislexia' },
        { btn: toggleLargeCursorBtn, key: 'largeCursor', name: 'Cursor grande' },
        { btn: toggleReadingGuideBtn, key: 'readingGuide', name: 'Guia de leitura' },
        { btn: toggleHighlightLinksBtn, key: 'highlightLinks', name: 'Destaque de links' }
    ].forEach(item => {
        if (item.btn) {
            item.btn.addEventListener('click', () => {
                currentAccessibilityState[item.key] = !currentAccessibilityState[item.key];
                applyAccessibilitySettings(); saveAccessibilitySettings();
                window.announceAccessibilityChange(`${item.name} ${currentAccessibilityState[item.key] ? 'ativado' : 'desativado'}.`);
            });
        }
    });

    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            const screenReaderWasActive = window.isScreenReaderActive; // Salva estado do leitor de tela
            currentAccessibilityState = { ...defaultAccessibilitySettings };
            applyAccessibilitySettings();
            // Não salvar screenReaderState aqui, pois ele é gerenciado por screen_reader.js
            const settingsToSave = { ...currentAccessibilityState };
            // delete settingsToSave.screenReader; // Garante que não sobrescrevemos o estado do leitor salvo por screen_reader.js
            localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settingsToSave));


            if (typeof window.resetScreenReaderUIToDefault === 'function') {
                window.resetScreenReaderUIToDefault(screenReaderWasActive); // Informa se deve manter o estado
            }
            window.announceAccessibilityChange('Ajustes visuais de acessibilidade redefinidos.');
        });
    }

    if (readingGuideElement) {
        document.addEventListener('mousemove', (e) => {
            if (currentAccessibilityState.readingGuide && readingGuideElement.classList.contains('active')) {
                readingGuideElement.style.top = `${e.clientY - (readingGuideElement.offsetHeight / 2)}px`;
            }
        });
    }
    loadAccessibilitySettings(); // Carrega configurações de acessibilidade visual
    console.log("Nave Azul: Handler de acessibilidade visual inicializado.");


    // --- PARTE DO SCREEN_READER.JS ---
    const screenReaderToggleBtn = document.getElementById('screenReaderToggle');
    const screenReaderControlsEl = document.getElementById('screenReaderControls');
    const readPageContentBtn = document.getElementById('readPageContent');
    const pauseReadingBtn = document.getElementById('pauseReading');
    const stopReadingBtn = document.getElementById('stopReading');

    window.speechSynth = window.speechSynthesis;
    let utterance = null;
    window.isScreenReaderActive = false;
    let isReadingPaused = false;

    function applyScreenReaderVisualState() {
        if (screenReaderToggleBtn) {
            screenReaderToggleBtn.textContent = window.isScreenReaderActive ? 'Desativar' : 'Ativar';
            screenReaderToggleBtn.setAttribute('aria-pressed', window.isScreenReaderActive);
        }
        if (screenReaderControlsEl) {
            screenReaderControlsEl.style.display = window.isScreenReaderActive ? 'flex' : 'none';
            if(pauseReadingBtn) pauseReadingBtn.disabled = true;
            if(stopReadingBtn) stopReadingBtn.disabled = true;
        }
        if (!window.isScreenReaderActive && window.speechSynth && window.speechSynth.speaking) {
            window.speechSynth.cancel();
            isReadingPaused = false;
        }
    }

    function saveScreenReaderState() {
        const existingSettings = JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) || '{}');
        const settingsToSave = { ...existingSettings, screenReader: window.isScreenReaderActive };
        localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settingsToSave));
    }

    function loadScreenReaderState() {
        const savedSettings = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                if (typeof parsedSettings.screenReader !== 'undefined') {
                    window.isScreenReaderActive = parsedSettings.screenReader;
                }
            } catch(e) { console.error("Nave Azul: Erro ao carregar estado do leitor de tela.", e); }
        }
        applyScreenReaderVisualState();
    }

    window.speakFromReader = function(text, interrupt = false) {
        if (!window.isScreenReaderActive || !window.speechSynth || !text) return;
        if (window.speechSynth.speaking && interrupt) {
            window.speechSynth.cancel(); isReadingPaused = false;
        } else if (window.speechSynth.speaking && !interrupt && !isReadingPaused) { return; }
        if (isReadingPaused && interrupt) {
            window.speechSynth.cancel(); isReadingPaused = false;
        }

        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        const voices = window.speechSynth.getVoices();
        const ptVoice = voices.find(voice => voice.lang === 'pt-BR' || voice.lang === 'pt_BR');
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onstart = () => {
            isReadingPaused = false;
            if (pauseReadingBtn) { pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; pauseReadingBtn.disabled = false; }
            if (stopReadingBtn) stopReadingBtn.disabled = false;
            if (readPageContentBtn) readPageContentBtn.disabled = true;
        };
        utterance.onend = () => {
            isReadingPaused = false;
            if (pauseReadingBtn) { pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; pauseReadingBtn.disabled = true; }
            if (stopReadingBtn) stopReadingBtn.disabled = true;
            if (readPageContentBtn) readPageContentBtn.disabled = false;
        };
        utterance.onerror = (event) => {
            console.error('Nave Azul: Erro na síntese de fala -', event.error);
            isReadingPaused = false;
            if (pauseReadingBtn) { pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; pauseReadingBtn.disabled = true; }
            if (stopReadingBtn) stopReadingBtn.disabled = true;
            if (readPageContentBtn) readPageContentBtn.disabled = false;
        };

        if (window.speechSynth.paused && isReadingPaused) {
             window.speechSynth.resume();
             setTimeout(() => { window.speechSynth.cancel(); window.speechSynth.speak(utterance); }, 50);
        } else { window.speechSynth.speak(utterance); }
    };

    if (window.speechSynth && window.speechSynth.onvoiceschanged !== undefined) {
        window.speechSynth.onvoiceschanged = () => { /* console.log("Vozes carregadas"); */ };
    }

    if (screenReaderToggleBtn) {
        screenReaderToggleBtn.addEventListener('click', () => {
            window.isScreenReaderActive = !window.isScreenReaderActive;
            applyScreenReaderVisualState(); saveScreenReaderState();
            window.announceAccessibilityChange(`Leitor de tela ${window.isScreenReaderActive ? 'ativado' : 'desativado'}.`);
            if (!window.isScreenReaderActive && window.speechSynth.speaking) window.speechSynth.cancel();
        });
    }

    if (readPageContentBtn) {
        readPageContentBtn.addEventListener('click', () => {
            const activePage = document.querySelector('main > .page.active'); // Busca dentro do main
            if (activePage && window.isScreenReaderActive) {
                let contentToRead = "";
                const pageTitleEl = activePage.querySelector('h1.page-title, h1.logo');
                if(pageTitleEl) contentToRead += pageTitleEl.textContent.trim() + ". ";
                const elementsToRead = activePage.querySelectorAll('h2:not(.sr-only), h3:not(.sr-only), h4:not(.sr-only), p, a:not([aria-hidden="true"]), li, [data-text-to-read]');
                elementsToRead.forEach(el => {
                    const style = window.getComputedStyle(el);
                    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return; // Checa opacidade também
                    const text = el.getAttribute('data-text-to-read') || el.textContent || el.innerText;
                    if (text && text.trim().length > 0) contentToRead += text.trim().replace(/\s+/g, ' ') + ". \n";
                });
                if (contentToRead.trim()) window.speakFromReader("Lendo conteúdo: " + contentToRead, true);
                else window.speakFromReader("Nenhum conteúdo textual principal para leitura.", true);
            }
        });
    }

    if (pauseReadingBtn) {
        pauseReadingBtn.addEventListener('click', () => {
            if (window.speechSynth && window.speechSynth.speaking && !isReadingPaused) {
                window.speechSynth.pause(); isReadingPaused = true;
                pauseReadingBtn.innerHTML = '<i class="fas fa-play"></i> Retomar';
            } else if (window.speechSynth && isReadingPaused) {
                window.speechSynth.resume(); isReadingPaused = false;
                pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            }
        });
    }

    if (stopReadingBtn) {
        stopReadingBtn.addEventListener('click', () => {
            if (window.speechSynth && (window.speechSynth.speaking || isReadingPaused)) {
                window.speechSynth.cancel();
                // onend do utterance já trata o reset dos botões
                window.announceAccessibilityChange("Leitura interrompida.");
            }
        });
    }

    window.resetScreenReaderUIToDefault = function(keepCurrentState = false) {
        if (!keepCurrentState) {
            window.isScreenReaderActive = false;
            saveScreenReaderState();
        }
        if (window.speechSynth && window.speechSynth.speaking) window.speechSynth.cancel();
        isReadingPaused = false;
        applyScreenReaderVisualState();
    };

    loadScreenReaderState(); // Carrega o estado do leitor de tela
    console.log("Nave Azul: Módulo do leitor de tela inicializado.");

    console.log("Nave Azul: Suíte de Acessibilidade Completa inicializada.");
};

// src/assets/js/accessibility.js

window.initAccessibilitySuite = function() {
    console.log("Nave Azul: Inicializando Suíte de Acessibilidade...");

    // --- LÓGICA DO PAINEL DE ACESSIBILIDADE VISUAL (DO ANTIGO accessibility_handler.js) ---
    const accessibilityToggle = document.getElementById('accessibilityToggle');
    const accessibilityPanel = document.getElementById('accessibilityPanel');

    const decreaseFontBtn = document.getElementById('decreaseFont');
    const increaseFontBtn = document.getElementById('increaseFont');
    const toggleContrastBtn = document.getElementById('toggleContrast');
    const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
    const toggleDyslexicFontBtn = document.getElementById('toggleDyslexicFont');
    const toggleLargeCursorBtn = document.getElementById('toggleLargeCursor');
    const toggleReadingGuideBtn = document.getElementById('toggleReadingGuide');
    const readingGuideElement = document.getElementById('readingGuide'); // Assegure que este ID exista no HTML base
    const toggleHighlightLinksBtn = document.getElementById('toggleHighlightLinks');
    const resetSettingsBtn = document.getElementById('resetSettings');

    const body = document.body;
    const ACCESSIBILITY_STORAGE_KEY = 'naveAzulAccessibilitySettings';

    const defaultVisualSettings = {
        fontSize: 16,
        highContrast: false,
        darkMode: false,
        dyslexicFont: false,
        largeCursor: false,
        readingGuide: false,
        highlightLinks: false,
    };

    // Estado combinado para localStorage, incluindo o estado do leitor de tela
    let combinedSettings = { ...defaultVisualSettings, screenReader: false };


    function applyVisualSettings() {
        document.documentElement.style.fontSize = `${combinedSettings.fontSize}px`;
        body.classList.toggle('high-contrast', combinedSettings.highContrast);
        if(toggleContrastBtn) {
            toggleContrastBtn.textContent = combinedSettings.highContrast ? 'Desativar' : 'Ativar';
            toggleContrastBtn.setAttribute('aria-pressed', combinedSettings.highContrast);
        }
        body.classList.toggle('dark-mode-explicit', combinedSettings.darkMode);
        if(toggleDarkModeBtn) {
            toggleDarkModeBtn.textContent = combinedSettings.darkMode ? 'Desativar' : 'Ativar';
            toggleDarkModeBtn.setAttribute('aria-pressed', combinedSettings.darkMode);
        }
        body.classList.toggle('dyslexic-font', combinedSettings.dyslexicFont);
        if(toggleDyslexicFontBtn) {
            toggleDyslexicFontBtn.textContent = combinedSettings.dyslexicFont ? 'Desativar' : 'Ativar';
            toggleDyslexicFontBtn.setAttribute('aria-pressed', combinedSettings.dyslexicFont);
        }
        body.classList.toggle('large-cursor', combinedSettings.largeCursor);
        if(toggleLargeCursorBtn) {
            toggleLargeCursorBtn.textContent = combinedSettings.largeCursor ? 'Desativar' : 'Ativar';
            toggleLargeCursorBtn.setAttribute('aria-pressed', combinedSettings.largeCursor);
        }
        if (readingGuideElement) readingGuideElement.classList.toggle('active', combinedSettings.readingGuide);
        if(toggleReadingGuideBtn) {
            toggleReadingGuideBtn.textContent = combinedSettings.readingGuide ? 'Desativar' : 'Ativar';
            toggleReadingGuideBtn.setAttribute('aria-pressed', combinedSettings.readingGuide);
        }
        body.classList.toggle('highlight-links', combinedSettings.highlightLinks);
        if(toggleHighlightLinksBtn) {
            toggleHighlightLinksBtn.textContent = combinedSettings.highlightLinks ? 'Desativar' : 'Ativar';
            toggleHighlightLinksBtn.setAttribute('aria-pressed', combinedSettings.highlightLinks);
        }
    }

    function saveCombinedSettings() {
        try {
            localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(combinedSettings));
        } catch (e) {
            console.error("Nave Azul: Erro ao salvar configurações no localStorage", e);
        }
    }

    function loadCombinedSettings() {
        const savedSettings = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                combinedSettings = { ...combinedSettings, ...parsedSettings }; // Mescla default com salvo
            } catch (e) {
                console.error("Nave Azul: Erro ao carregar configurações do localStorage", e);
                // Mantém combinedSettings com os defaults (já inclui screenReader: false)
            }
        }
        applyVisualSettings();
        // O estado visual do leitor de tela será aplicado por sua própria lógica abaixo
    }

    window.announceAccessibilityChange = function(message) {
        let announcer = document.getElementById('accessibility-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'accessibility-announcer';
            announcer.setAttribute('aria-live', 'assertive');
            announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;';
            document.body.appendChild(announcer);
        }
        announcer.textContent = '';
        setTimeout(() => { announcer.textContent = message; }, 150);

        if (window.isScreenReaderActive && window.speechSynth && typeof window.speakFromReader === 'function') {
            window.speakFromReader(message, true);
        }
    };

    if (accessibilityToggle && accessibilityPanel) {
        accessibilityToggle.addEventListener('click', () => {
            const isActive = accessibilityPanel.classList.toggle('active');
            accessibilityToggle.setAttribute('aria-expanded', isActive);
            accessibilityPanel.setAttribute('aria-hidden', !isActive);
            if (isActive) {
                accessibilityPanel.querySelector('button:not([disabled])')?.focus();
                window.announceAccessibilityChange('Painel de acessibilidade aberto.');
            } else {
                window.announceAccessibilityChange('Painel de acessibilidade fechado.');
            }
        });
    } else {
        console.warn("Nave Azul: Botão de toggle de acessibilidade ou painel não encontrado.");
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accessibilityPanel && accessibilityPanel.classList.contains('active')) {
            accessibilityPanel.classList.remove('active');
            if (accessibilityToggle) {
                accessibilityToggle.setAttribute('aria-expanded', 'false');
                accessibilityToggle.focus();
            }
            accessibilityPanel.setAttribute('aria-hidden', 'true');
            window.announceAccessibilityChange('Painel de acessibilidade fechado.');
        }
    });

    if (decreaseFontBtn) decreaseFontBtn.addEventListener('click', () => {
        if (combinedSettings.fontSize > 10) {
            combinedSettings.fontSize -= 1;
            applyVisualSettings(); saveCombinedSettings();
            window.announceAccessibilityChange(`Tamanho da fonte ${combinedSettings.fontSize} pixels.`);
        }
    });
    if (increaseFontBtn) increaseFontBtn.addEventListener('click', () => {
        if (combinedSettings.fontSize < 28) {
            combinedSettings.fontSize += 1;
            applyVisualSettings(); saveCombinedSettings();
            window.announceAccessibilityChange(`Tamanho da fonte ${combinedSettings.fontSize} pixels.`);
        }
    });

    [
        { btn: toggleContrastBtn, key: 'highContrast', name: 'Alto contraste' },
        { btn: toggleDarkModeBtn, key: 'darkMode', name: 'Modo escuro explícito' },
        { btn: toggleDyslexicFontBtn, key: 'dyslexicFont', name: 'Fonte para dislexia' },
        { btn: toggleLargeCursorBtn, key: 'largeCursor', name: 'Cursor grande' },
        { btn: toggleReadingGuideBtn, key: 'readingGuide', name: 'Guia de leitura' },
        { btn: toggleHighlightLinksBtn, key: 'highlightLinks', name: 'Destaque de links' }
    ].forEach(item => {
        if (item.btn) {
            item.btn.addEventListener('click', () => {
                combinedSettings[item.key] = !combinedSettings[item.key];
                applyVisualSettings(); saveCombinedSettings();
                window.announceAccessibilityChange(`${item.name} ${combinedSettings[item.key] ? 'ativado' : 'desativado'}.`);
            });
        }
    });

    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            const screenReaderWasActive = combinedSettings.screenReader; // Salva estado do leitor
            combinedSettings = { ...defaultAccessibilitySettings, screenReader: screenReaderWasActive }; // Reseta visuais, mantém estado do leitor
            applyVisualSettings();
            // A UI do leitor de tela será atualizada por sua própria lógica ao final desta função
            // Não precisamos chamar resetScreenReaderUIToDefault explicitamente aqui, pois applyScreenReaderVisualState
            // será chamado e refletirá o combinedSettings.screenReader.
            saveCombinedSettings(); // Salva o estado resetado (com o estado do leitor preservado)
            window.announceAccessibilityChange('Ajustes visuais de acessibilidade redefinidos.');
            applyScreenReaderVisualState(); // Garante que a UI do botão do leitor reflita o estado
        });
    }

    if (readingGuideElement) {
        document.addEventListener('mousemove', (e) => {
            if (combinedSettings.readingGuide && readingGuideElement.classList.contains('active')) {
                readingGuideElement.style.top = `${e.clientY - (readingGuideElement.offsetHeight / 2)}px`;
            }
        });
    }
    // loadVisualSettings() será chamado por loadCombinedSettings()

    // --- LÓGICA DO LEITOR DE TELA (DO ANTIGO screen_reader.js) ---
    const screenReaderToggleBtn = document.getElementById('screenReaderToggle');
    const screenReaderControlsEl = document.getElementById('screenReaderControls');
    const readPageContentBtn = document.getElementById('readPageContent');
    const pauseReadingBtn = document.getElementById('pauseReading');
    const stopReadingBtn = document.getElementById('stopReading');

    window.speechSynth = window.speechSynthesis;
    let utterance = null;
    // window.isScreenReaderActive é agora combinedSettings.screenReader
    let isReadingPaused = false;

    function applyScreenReaderVisualState() { // Atualiza a UI do leitor
        if (screenReaderToggleBtn) {
            screenReaderToggleBtn.textContent = combinedSettings.screenReader ? 'Desativar' : 'Ativar';
            screenReaderToggleBtn.setAttribute('aria-pressed', combinedSettings.screenReader);
        }
        if (screenReaderControlsEl) {
            screenReaderControlsEl.style.display = combinedSettings.screenReader ? 'flex' : 'none';
            if(pauseReadingBtn) pauseReadingBtn.disabled = true;
            if(stopReadingBtn) stopReadingBtn.disabled = true;
        }
        if (!combinedSettings.screenReader && window.speechSynth && window.speechSynth.speaking) {
            window.speechSynth.cancel();
            isReadingPaused = false;
        }
    }

    // window.speakFromReader já está definido no accessibility_handler.js e usa window.isScreenReaderActive
    // Vamos garantir que ele use combinedSettings.screenReader
    window.speakFromReader = function(text, interrupt = false) {
        if (!combinedSettings.screenReader || !window.speechSynth || !text) return;
        if (window.speechSynth.speaking && interrupt) {
            window.speechSynth.cancel(); isReadingPaused = false;
        } else if (window.speechSynth.speaking && !interrupt && !isReadingPaused) { return; }
        if (isReadingPaused && interrupt) {
            window.speechSynth.cancel(); isReadingPaused = false;
        }

        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        const voices = window.speechSynth.getVoices();
        const ptVoice = voices.find(voice => voice.lang === 'pt-BR' || voice.lang === 'pt_BR');
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onstart = () => {
            isReadingPaused = false;
            if (pauseReadingBtn) { pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; pauseReadingBtn.disabled = false; }
            if (stopReadingBtn) stopReadingBtn.disabled = false;
            if (readPageContentBtn) readPageContentBtn.disabled = true;
        };
        utterance.onend = () => {
            isReadingPaused = false;
            if (pauseReadingBtn) { pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; pauseReadingBtn.disabled = true; }
            if (stopReadingBtn) stopReadingBtn.disabled = true;
            if (readPageContentBtn) readPageContentBtn.disabled = false;
        };
        utterance.onerror = (event) => {
            console.error('Nave Azul: Erro na síntese de fala -', event.error);
            isReadingPaused = false; /* ... resetar botões ... */
            if (pauseReadingBtn) { pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar'; pauseReadingBtn.disabled = true; }
            if (stopReadingBtn) stopReadingBtn.disabled = true;
            if (readPageContentBtn) readPageContentBtn.disabled = false;
        };
        if (window.speechSynth.paused && isReadingPaused) {
             window.speechSynth.resume();
             setTimeout(() => { window.speechSynth.cancel(); window.speechSynth.speak(utterance); }, 50);
        } else { window.speechSynth.speak(utterance); }
    };
    // Expor isScreenReaderActive para outros scripts poderem checar (como o announcer)
    Object.defineProperty(window, 'isScreenReaderActive', {
        get: function() { return combinedSettings.screenReader; }
    });


    if (window.speechSynth && window.speechSynth.onvoiceschanged !== undefined) {
        window.speechSynth.onvoiceschanged = () => { /* console.log("Vozes carregadas"); */ };
    }

    if (screenReaderToggleBtn) {
        screenReaderToggleBtn.addEventListener('click', () => {
            combinedSettings.screenReader = !combinedSettings.screenReader;
            applyScreenReaderVisualState(); saveCombinedSettings();
            window.announceAccessibilityChange(`Leitor de tela ${combinedSettings.screenReader ? 'ativado' : 'desativado'}.`);
            if (!combinedSettings.screenReader && window.speechSynth.speaking) window.speechSynth.cancel();
        });
    }

    if (readPageContentBtn) {
        readPageContentBtn.addEventListener('click', () => {
            const activePage = document.querySelector('main > .page.active');
            if (activePage && combinedSettings.screenReader) {
                let contentToRead = "";
                const pageTitleEl = activePage.querySelector('h1.page-title, h1.logo');
                if(pageTitleEl) contentToRead += pageTitleEl.textContent.trim() + ". ";
                const elementsToRead = activePage.querySelectorAll('h2:not(.sr-only), h3:not(.sr-only), h4:not(.sr-only), p, a:not([aria-hidden="true"]), li, [data-text-to-read]');
                elementsToRead.forEach(el => {
                    const style = window.getComputedStyle(el);
                    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;
                    const text = el.getAttribute('data-text-to-read') || el.textContent || el.innerText;
                    if (text && text.trim().length > 0) contentToRead += text.trim().replace(/\s+/g, ' ') + ". \n";
                });
                if (contentToRead.trim()) window.speakFromReader("Lendo conteúdo: " + contentToRead, true);
                else window.speakFromReader("Nenhum conteúdo textual principal para leitura.", true);
            }
        });
    }

    if (pauseReadingBtn) {
        pauseReadingBtn.addEventListener('click', () => {
            if (window.speechSynth && window.speechSynth.speaking && !isReadingPaused) {
                window.speechSynth.pause(); isReadingPaused = true;
                pauseReadingBtn.innerHTML = '<i class="fas fa-play"></i> Retomar';
            } else if (window.speechSynth && isReadingPaused) {
                window.speechSynth.resume(); isReadingPaused = false;
                pauseReadingBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            }
        });
    }

    if (stopReadingBtn) {
        stopReadingBtn.addEventListener('click', () => {
            if (window.speechSynth && (window.speechSynth.speaking || isReadingPaused)) {
                window.speechSynth.cancel();
                window.announceAccessibilityChange("Leitura interrompida.");
            }
        });
    }
    // Esta função é chamada pelo botão de reset geral de acessibilidade
    window.resetScreenReaderUIToDefault = function(keepCurrentState = false) {
        if (!keepCurrentState) {
            combinedSettings.screenReader = false; // Reseta o estado
            saveCombinedSettings(); // Salva
        }
         if (window.speechSynth && window.speechSynth.speaking) {
            window.speechSynth.cancel();
        }
        isReadingPaused = false;
        applyScreenReaderVisualState(); // Aplica o estado visual (que pode ser 'desativado')
    };


    loadCombinedSettings(); // Carrega todas as configurações, incluindo o estado do leitor
    applyScreenReaderVisualState(); // Aplica o estado visual do leitor com base no que foi carregado
    console.log("Nave Azul: Suíte de Acessibilidade (Visual + Leitor) inicializada.");
};