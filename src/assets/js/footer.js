// src/assets/js/footer.js
window.initFooter = function() {
    console.log("Nave Azul: Inicializando Footer...");

    // Ano Atual no Rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Nave Azul: Elemento 'currentYear' não encontrado no footer.");
    }

    // Lógica para Abrir Painel de Acessibilidade pelo Link do Footer
    const openAccessibilityFromFooter = document.getElementById('openAccessibilityFromFooter');
    const accessibilityPanel = document.getElementById('accessibilityPanel'); // Painel em si
    const accessibilityToggleBtn = document.getElementById('accessibilityToggle'); // Botão principal do painel

    if (openAccessibilityFromFooter && accessibilityPanel && accessibilityToggleBtn) {
        openAccessibilityFromFooter.addEventListener('click', (e) => {
            e.preventDefault();
            const panelIsActive = accessibilityPanel.classList.contains('active');

            if (panelIsActive && e.target === openAccessibilityFromFooter) {
                // Se o painel já está aberto E o clique foi no link do footer,
                // talvez não fazer nada ou rolar para o painel?
                // Por ora, vamos manter o comportamento de toggle (abrir se fechado, focar se aberto).
                accessibilityPanel.querySelector('button:not([disabled])')?.focus();
                return;
            }
            
            accessibilityPanel.classList.add('active');
            accessibilityToggleBtn.setAttribute('aria-expanded', 'true');
            accessibilityPanel.setAttribute('aria-hidden', 'false');

            // Foca no primeiro elemento interativo dentro do painel
            const firstFocusableElement = accessibilityPanel.querySelector(
                'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
            if (window.announceAccessibilityChange) window.announceAccessibilityChange('Painel de acessibilidade aberto a partir do rodapé.');
        });
    } else {
        // console.warn("Nave Azul: Elementos para abrir painel de acessibilidade pelo footer não encontrados.");
    }
    console.log("Nave Azul: Footer inicializado.");
};