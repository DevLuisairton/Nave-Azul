// src/assets/js/footer.js
window.initFooter = function() {
    console.log("Nave Azul: Inicializando Footer...");

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Nave Azul: Elemento 'currentYear' não encontrado no footer.");
    }

    const openAccessibilityFromFooter = document.getElementById('openAccessibilityFromFooter');
    const accessibilityPanel = document.getElementById('accessibilityPanel');
    const accessibilityToggleBtn = document.getElementById('accessibilityToggle');

    if (openAccessibilityFromFooter && accessibilityPanel && accessibilityToggleBtn) {
        openAccessibilityFromFooter.addEventListener('click', (e) => {
            e.preventDefault();
            const panelIsActive = accessibilityPanel.classList.contains('active');

            // Toggle behavior: Se clicar e estiver fechado, abre. Se clicar e estiver aberto, foca.
            // Para fechar, o usuário usaria o botão de fechar do painel ou ESC.
            if (!panelIsActive) {
                accessibilityPanel.classList.add('active');
                accessibilityToggleBtn.setAttribute('aria-expanded', 'true');
                accessibilityPanel.setAttribute('aria-hidden', 'false');
                if(window.announceAccessibilityChange) window.announceAccessibilityChange('Painel de acessibilidade aberto a partir do rodapé.');
            }
            // Sempre tenta focar no primeiro elemento, mesmo que já esteja aberto
            const firstFocusableElement = accessibilityPanel.querySelector(
                'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        });
    }
    console.log("Nave Azul: Footer inicializado.");
};