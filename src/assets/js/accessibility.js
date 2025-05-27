// Navegação suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion) {
                target.scrollIntoView();
            } else {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });
});

// Função para anunciar mensagens para leitores de tela
function announceToScreenReader(message) {
    const announcer = document.getElementById('announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => announcer.textContent = '', 1000);
    }
}

// Detecta preferência de movimento reduzido
function checkMotionPreference() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduce-motion');
    }
    
    prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    });
}

// Mensagem de boas-vindas após carregamento
window.addEventListener('load', () => {
    checkMotionPreference();
    setTimeout(() => {
        announceToScreenReader('Bem-vindo à Nave Azul. Página carregada e pronta para uso.');
    }, 1000);
});

// Estado global de acessibilidade
const accessibilityState = {
    fontSize: 100,
    highContrast: false,
    darkMode: false,
    dyslexiaFont: false,
    largeCursor: false,
    readingGuide: false,
    focusIndicator: false,
    colorFilter: 'none'
};

// Elementos do DOM
const accessibilityToggle = document.getElementById('accessibilityToggle');
const accessibilityPanel = document.getElementById('accessibilityPanel');
const panelClose = document.getElementById('panelClose');
const fontIncrease = document.getElementById('fontIncrease');
const fontDecrease = document.getElementById('fontDecrease');
const fontReset = document.getElementById('fontReset');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const highContrastToggle = document.getElementById('highContrast');
const darkModeToggle = document.getElementById('darkMode');
const dyslexiaFontToggle = document.getElementById('dyslexiaFont');
const largeCursorToggle = document.getElementById('largeCursor');
const readingGuideToggle = document.getElementById('readingGuideToggle');
const readingGuideElement = document.getElementById('readingGuideElement');
const focusIndicatorToggle = document.getElementById('focusIndicatorToggle');
const focusIndicatorElement = document.getElementById('focusIndicatorElement');
const colorOptions = document.querySelectorAll('.color-option');
const resetAll = document.getElementById('resetAll');

// === TOGGLE MÓVEL ===
let isDragging = false;
let startY, startTop;

function setupToggleDrag() {
    accessibilityToggle.addEventListener('mousedown', (e) => {
        if (accessibilityPanel.classList.contains('open')) return;
        
        isDragging = true;
        startY = e.clientY;
        startTop = parseInt(window.getComputedStyle(accessibilityToggle).top, 10) || 50;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaY = e.clientY - startY;
        let newTop = startTop + deltaY;
        
        // Limitar movimento dentro da janela
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - accessibilityToggle.offsetHeight));
        
        accessibilityToggle.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });

    // Toque para dispositivos móveis
    accessibilityToggle.addEventListener('touchstart', (e) => {
        if (accessibilityPanel.classList.contains('open')) return;
        
        isDragging = true;
        startY = e.touches[0].clientY;
        startTop = parseInt(window.getComputedStyle(accessibilityToggle).top, 10) || 50;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const deltaY = e.touches[0].clientY - startY;
        let newTop = startTop + deltaY;
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - accessibilityToggle.offsetHeight));
        accessibilityToggle.style.top = `${newTop}px`;
        e.preventDefault();
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';
        }
    });
}

// === CONTROLE DO PAINEL DE ACESSIBILIDADE ===
function toggleAccessibilityPanel() {
    const isOpen = accessibilityPanel.classList.contains('open');

    if (isOpen) {
        accessibilityPanel.classList.remove('open');
        accessibilityPanel.setAttribute('aria-hidden', 'true');
        accessibilityToggle.setAttribute('aria-expanded', 'false');
        accessibilityToggle.focus();
    } else {
        accessibilityPanel.classList.add('open');
        accessibilityPanel.setAttribute('aria-hidden', 'false');
        accessibilityToggle.setAttribute('aria-expanded', 'true');
        panelClose.focus();
    }
}

// === CONTROLE DE TAMANHO DE FONTE ===
function updateFontSize(newSize) {
    accessibilityState.fontSize = Math.max(75, Math.min(200, newSize));
    document.documentElement.style.fontSize = `${accessibilityState.fontSize}%`;
    
    if (fontSizeDisplay) {
        fontSizeDisplay.textContent = `${accessibilityState.fontSize}%`;
    }
    
    announceToScreenReader(`Tamanho da fonte alterado para ${accessibilityState.fontSize}%`);
    savePreferences();
}

// === CONTROLES DE ACESSIBILIDADE ===
function setupAccessibilityControls() {
    // Tamanho da fonte
    if (fontIncrease) fontIncrease.addEventListener('click', () => updateFontSize(accessibilityState.fontSize + 10));
    if (fontDecrease) fontDecrease.addEventListener('click', () => updateFontSize(accessibilityState.fontSize - 10));
    if (fontReset) fontReset.addEventListener('click', () => updateFontSize(100));

    // Alto contraste
    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', (e) => {
            accessibilityState.highContrast = e.target.checked;
            document.body.classList.toggle('high-contrast', accessibilityState.highContrast);
            announceToScreenReader(`Modo de alto contraste ${accessibilityState.highContrast ? 'ativado' : 'desativado'}`);
            savePreferences();
        });
    }

    // Modo escuro
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            accessibilityState.darkMode = e.target.checked;
            document.body.classList.toggle('dark-mode', accessibilityState.darkMode);
            announceToScreenReader(`Modo escuro ${accessibilityState.darkMode ? 'ativado' : 'desativado'}`);
            savePreferences();
        });
    }

    // Fonte para dislexia
    if (dyslexiaFontToggle) {
        dyslexiaFontToggle.addEventListener('change', (e) => {
            accessibilityState.dyslexiaFont = e.target.checked;
            document.body.classList.toggle('dyslexia-font', accessibilityState.dyslexiaFont);
            announceToScreenReader(`Fonte para dislexia ${accessibilityState.dyslexiaFont ? 'ativada' : 'desativada'}`);
            savePreferences();
        });
    }

    // Cursor grande
    if (largeCursorToggle) {
        largeCursorToggle.addEventListener('change', (e) => {
            accessibilityState.largeCursor = e.target.checked;
            document.body.classList.toggle('large-cursor', accessibilityState.largeCursor);
            announceToScreenReader(`Cursor grande ${accessibilityState.largeCursor ? 'ativado' : 'desativado'}`);
            savePreferences();
        });
    }

    // Guia de leitura
    if (readingGuideToggle && readingGuideElement) {
        readingGuideToggle.addEventListener('change', (e) => {
            accessibilityState.readingGuide = e.target.checked;
            readingGuideElement.classList.toggle('active', accessibilityState.readingGuide);
            announceToScreenReader(`Guia de leitura ${accessibilityState.readingGuide ? 'ativado' : 'desativado'}`);
            savePreferences();
        });

        document.addEventListener('mousemove', (e) => {
            if (accessibilityState.readingGuide) {
                readingGuideElement.style.top = `${e.clientY}px`;
            }
        });
    }

    // Indicador de foco
    if (focusIndicatorToggle && focusIndicatorElement) {
        focusIndicatorToggle.addEventListener('change', (e) => {
            accessibilityState.focusIndicator = e.target.checked;
            announceToScreenReader(`Indicador de foco ${accessibilityState.focusIndicator ? 'ativado' : 'desativado'}`);
            savePreferences();
        });

        document.addEventListener('focusin', (e) => {
            if (accessibilityState.focusIndicator && e.target) {
                const rect = e.target.getBoundingClientRect();
                focusIndicatorElement.style.left = `${rect.left - 4}px`;
                focusIndicatorElement.style.top = `${rect.top - 4}px`;
                focusIndicatorElement.style.width = `${rect.width + 8}px`;
                focusIndicatorElement.style.height = `${rect.height + 8}px`;
                focusIndicatorElement.classList.add('active');
            }
        });

        document.addEventListener('focusout', () => {
            if (accessibilityState.focusIndicator) {
                focusIndicatorElement.classList.remove('active');
            }
        });
    }

    // Filtros de cor
    const colorFilters = {
        none: '',
        protanopia: 'sepia(100%) saturate(20%) hue-rotate(80deg)',
        deuteranopia: 'sepia(100%) saturate(60%) hue-rotate(90deg)',
        tritanopia: 'sepia(100%) saturate(80%) hue-rotate(180deg)',
        achromatopsia: 'grayscale(100%)',
        'blue-yellow': 'sepia(100%) saturate(200%) hue-rotate(60deg)'
    };

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.setAttribute('aria-checked', 'false');
                opt.setAttribute('tabindex', '-1');
            });

            option.classList.add('active');
            option.setAttribute('aria-checked', 'true');
            option.setAttribute('tabindex', '0');

            const filter = option.dataset.filter;
            accessibilityState.colorFilter = filter;
            document.body.style.filter = colorFilters[filter];
            announceToScreenReader(`Filtro ${filter === 'none' ? 'removido' : `para ${filter} aplicado`}`);
            savePreferences();
        });

        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                option.click();
            }
        });
    });

    // Resetar todas as configurações
    if (resetAll) {
        resetAll.addEventListener('click', () => {
            // Resetar estado
            accessibilityState.fontSize = 100;
            accessibilityState.highContrast = false;
            accessibilityState.darkMode = false;
            accessibilityState.dyslexiaFont = false;
            accessibilityState.largeCursor = false;
            accessibilityState.readingGuide = false;
            accessibilityState.focusIndicator = false;
            accessibilityState.colorFilter = 'none';

            // Aplicar reset
            updateFontSize(100);
            document.body.classList.remove('high-contrast', 'dark-mode', 'dyslexia-font', 'large-cursor');
            document.body.style.filter = '';
            if (highContrastToggle) highContrastToggle.checked = false;
            if (darkModeToggle) darkModeToggle.checked = false;
            if (dyslexiaFontToggle) dyslexiaFontToggle.checked = false;
            if (largeCursorToggle) largeCursorToggle.checked = false;
            if (readingGuideToggle) readingGuideToggle.checked = false;
            if (focusIndicatorToggle) focusIndicatorToggle.checked = false;
            if (readingGuideElement) readingGuideElement.classList.remove('active');
            if (focusIndicatorElement) focusIndicatorElement.classList.remove('active');

            // Resetar seleção de cores
            colorOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.setAttribute('aria-checked', 'false');
                opt.setAttribute('tabindex', '-1');
            });
            document.querySelector('.color-option[data-filter="none"]').classList.add('active');
            document.querySelector('.color-option[data-filter="none"]').setAttribute('aria-checked', 'true');
            document.querySelector('.color-option[data-filter="none"]').setAttribute('tabindex', '0');

            announceToScreenReader('Todas as configurações foram resetadas para os valores padrão');
            savePreferences();
        });
    }
}

// === PERSISTÊNCIA DAS CONFIGURAÇÕES ===
function savePreferences() {
    try {
        localStorage.setItem('accessibilityPreferences', JSON.stringify(accessibilityState));
    } catch (e) {
        console.error('Erro ao salvar preferências:', e);
    }
}

function loadPreferences() {
    try {
        const savedPrefs = localStorage.getItem('accessibilityPreferences');
        if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs);
            Object.assign(accessibilityState, prefs);
            
            // Aplicar preferências carregadas
            updateFontSize(accessibilityState.fontSize);
            
            if (accessibilityState.highContrast) {
                document.body.classList.add('high-contrast');
                if (highContrastToggle) highContrastToggle.checked = true;
            }
            
            if (accessibilityState.darkMode) {
                document.body.classList.add('dark-mode');
                if (darkModeToggle) darkModeToggle.checked = true;
            }
            
            if (accessibilityState.dyslexiaFont) {
                document.body.classList.add('dyslexia-font');
                if (dyslexiaFontToggle) dyslexiaFontToggle.checked = true;
            }
            
            if (accessibilityState.largeCursor) {
                document.body.classList.add('large-cursor');
                if (largeCursorToggle) largeCursorToggle.checked = true;
            }
            
            if (accessibilityState.readingGuide) {
                if (readingGuideToggle) readingGuideToggle.checked = true;
                if (readingGuideElement) readingGuideElement.classList.add('active');
            }
            
            if (accessibilityState.focusIndicator) {
                if (focusIndicatorToggle) focusIndicatorToggle.checked = true;
            }
            
            if (accessibilityState.colorFilter) {
                const colorFilters = {
                    none: '',
                    protanopia: 'sepia(100%) saturate(20%) hue-rotate(80deg)',
                    deuteranopia: 'sepia(100%) saturate(60%) hue-rotate(90deg)',
                    tritanopia: 'sepia(100%) saturate(80%) hue-rotate(180deg)',
                    achromatopsia: 'grayscale(100%)',
                    'blue-yellow': 'sepia(100%) saturate(200%) hue-rotate(60deg)'
                };
                
                document.body.style.filter = colorFilters[accessibilityState.colorFilter];
                
                colorOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.setAttribute('aria-checked', 'false');
                    opt.setAttribute('tabindex', '-1');
                });
                
                const activeOption = document.querySelector(`.color-option[data-filter="${accessibilityState.colorFilter}"]`);
                if (activeOption) {
                    activeOption.classList.add('active');
                    activeOption.setAttribute('aria-checked', 'true');
                    activeOption.setAttribute('tabindex', '0');
                }
            }
        }
    } catch (e) {
        console.error('Erro ao carregar preferências:', e);
    }
}

// === INICIALIZAÇÃO ===
function initAccessibility() {
    // Configurar arraste do toggle
    setupToggleDrag();
    
    // Configurar painel de acessibilidade
    if (accessibilityToggle && accessibilityPanel && panelClose) {
        accessibilityToggle.addEventListener('click', toggleAccessibilityPanel);
        panelClose.addEventListener('click', toggleAccessibilityPanel);
    }

    // Fechar painel com Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accessibilityPanel && accessibilityPanel.classList.contains('open')) {
            toggleAccessibilityPanel();
        }
    });

    // Configurar controles
    setupAccessibilityControls();
    
    // Carregar preferências salvas
    loadPreferences();
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initAccessibility);