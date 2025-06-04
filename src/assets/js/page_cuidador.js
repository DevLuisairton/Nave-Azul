// src/assets/js/pages/page_cuidador.js
window.initCuidadorPage = function() {
    console.log("Nave Azul: Inicializando interações da Página de Apoio ao Cuidador (Foco em Autocuidado)...");

    // --- INÍCIO: LÓGICA DAS ABAS DA SEÇÃO DE AUTOCUIDADO ---
    const selfCareSection = document.getElementById('selfCareSection');
    if (selfCareSection) {
        const tabButtons = selfCareSection.querySelectorAll('.tab-button');
        const tabContents = selfCareSection.querySelectorAll('.tab-content');

        if (tabButtons.length > 0 && tabContents.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                    });
                    tabContents.forEach(content => content.classList.remove('active'));

                    button.classList.add('active');
                    button.setAttribute('aria-selected', 'true');
                    const tabId = button.dataset.tab;
                    const targetContent = document.getElementById(tabId + "Content"); // Ex: relaxationContent
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                    if (window.announceAccessibilityChange && typeof window.announceAccessibilityChange === 'function') {
                        window.announceAccessibilityChange(`Aba ${button.textContent.trim()} selecionada.`);
                    }
                });
            });

            // Garante que a primeira aba (Relaxamento) esteja ativa ao carregar, se nenhuma já estiver.
            const isActiveTabPresent = Array.from(tabButtons).some(btn => btn.classList.contains('active'));
            if (!isActiveTabPresent && tabButtons[0]) {
                tabButtons[0].classList.add('active');
                tabButtons[0].setAttribute('aria-selected', 'true');
                const firstTabId = tabButtons[0].dataset.tab;
                const firstTargetContent = document.getElementById(firstTabId + "Content");
                if (firstTargetContent) {
                    firstTargetContent.classList.add('active');
                }
            }
        } else {
            console.warn("Nave Azul [Cuidador]: Botões ou conteúdos das abas de autocuidado não encontrados dentro de #selfCareSection.");
        }
    } else {
        console.warn("Nave Azul [Cuidador]: Seção #selfCareSection não encontrada.");
    }
    // --- FIM: LÓGICA DAS ABAS ---


    // --- INÍCIO: EXERCÍCIO DE RESPIRAÇÃO (PARA A ABA DE RELAXAMENTO DO CUIDADOR) ---
    const breathingCircleCuidador = document.getElementById('breathingCircleCuidador');
    const startStopBreathingBtnCuidador = document.getElementById('startStopBreathingBtnCuidador');
    const breathingGuideTextCuidador = document.getElementById('breathingGuideTextCuidador');
    const breathingInstructionTextCuidador = document.getElementById('breathingInstructionTextCuidador'); // Certifique-se que este ID existe no HTML

    let isCuidadorBreathing = false;
    let breathCycleTimeoutIdCuidador;
    const breathCycleDefinitionCuidador = [
        { phase: "Inspire", duration: 4000, instruction: "Puxe o ar profundamente pelo nariz...", cssClass: 'inhaling' },
        { phase: "Segure", duration: 4500, instruction: "Mantenha o ar, sinta a calma...", cssClass: 'holding' },
        { phase: "Expire", duration: 6500, instruction: "Solte o ar lentamente pela boca...", cssClass: 'exhaling' },
        { phase: "Relaxe", duration: 2000, instruction: "Permita-se este momento...", cssClass: 'paused-breath' }
    ];
    let currentBreathPhaseIndexCuidador = 0;

    function updateCuidadorBreathingVisuals() {
        if (!breathingCircleCuidador || !breathingGuideTextCuidador || !startStopBreathingBtnCuidador || !breathingInstructionTextCuidador) {
            // console.warn("Nave Azul [Cuidador]: Elementos da respiração não encontrados para atualização.");
            return;
        }

        const currentPhase = breathCycleDefinitionCuidador[currentBreathPhaseIndexCuidador];

        if (!isCuidadorBreathing) {
            breathingCircleCuidador.className = 'breathing-circle'; // Reseta para o estado base
            breathingGuideTextCuidador.textContent = "Iniciar Ciclo";
            breathingInstructionTextCuidador.textContent = "Encontre seu ritmo";
            startStopBreathingBtnCuidador.innerHTML = '<i class="fas fa-play"></i> Iniciar';
            startStopBreathingBtnCuidador.setAttribute('aria-label', 'Iniciar exercício de respiração');
            breathingCircleCuidador.setAttribute('aria-label', 'Círculo de respiração. Toque para iniciar o ciclo de respiração.');
            return;
        }

        breathingGuideTextCuidador.textContent = currentPhase.phase;
        breathingInstructionTextCuidador.textContent = currentPhase.instruction;

        breathingCircleCuidador.className = 'breathing-circle breathing-active-simple'; // Classe base de animação (se você tiver uma animação genérica)
        breathingCircleCuidador.classList.add(currentPhase.cssClass); // Adiciona classe da fase específica para cor/transform

        startStopBreathingBtnCuidador.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        startStopBreathingBtnCuidador.setAttribute('aria-label', 'Pausar exercício de respiração');
        breathingCircleCuidador.setAttribute('aria-label', `Círculo de respiração. Fase: ${currentPhase.phase}. Toque para pausar.`);

        if (window.speakFromReader && typeof window.speakFromReader === 'function') {
            window.speakFromReader(`${currentPhase.phase}. ${currentPhase.instruction}`);
        }

        clearTimeout(breathCycleTimeoutIdCuidador);
        breathCycleTimeoutIdCuidador = setTimeout(() => {
            if (breathingCircleCuidador) breathingCircleCuidador.classList.remove(currentPhase.cssClass); // Remove classe da fase anterior
            currentBreathPhaseIndexCuidador = (currentBreathPhaseIndexCuidador + 1) % breathCycleDefinitionCuidador.length;
            if (isCuidadorBreathing) {
                updateCuidadorBreathingVisuals();
            }
        }, currentPhase.duration);
    }

    function toggleCuidadorBreathing() {
        isCuidadorBreathing = !isCuidadorBreathing;
        clearTimeout(breathCycleTimeoutIdCuidador); // Limpa timeout anterior ao togglar
        if (isCuidadorBreathing) {
            currentBreathPhaseIndexCuidador = 0; // Reinicia o ciclo se estiver começando
        }
        updateCuidadorBreathingVisuals(); // Atualiza a UI para o novo estado

        if (!isCuidadorBreathing && window.speakFromReader && typeof window.speakFromReader === 'function') {
            window.speakFromReader("Exercício de respiração para cuidadores pausado.");
        }
    }

    if (breathingCircleCuidador && startStopBreathingBtnCuidador) {
        breathingCircleCuidador.addEventListener('click', toggleCuidadorBreathing);
        startStopBreathingBtnCuidador.addEventListener('click', toggleCuidadorBreathing);
        updateCuidadorBreathingVisuals(); // Configura o estado inicial do botão e textos
    } else if (document.querySelector('.breathing-exercise-cuidador')) {
        console.warn("Nave Azul [Cuidador]: Elementos do exercício de respiração não encontrados no DOM para adicionar listeners.");
    }
    // --- FIM: EXERCÍCIO DE RESPIRAÇÃO ---


    // --- INÍCIO: PLAYER DE ÁUDIO (PARA A ABA DE RELAXAMENTO DO CUIDADOR) ---
    const audioButtonsCuidador = document.querySelectorAll('.audio-guides-cuidador .audio-button');
    const audioPlayerCuidador = document.getElementById('audioPlayerCuidador'); // Certifique-se que este <audio> existe no HTML
    let currentPlayingAudioButtonCuidador = null;

    if (audioButtonsCuidador.length > 0 && audioPlayerCuidador) {
        audioButtonsCuidador.forEach(button => {
            button.addEventListener('click', function() { // Usar function() para 'this' correto
                const soundSrcFromFile = this.dataset.src;
                // Ajusta o caminho para MPA se o script está em pages/ e sounds em assets/sounds
                const soundSrc = soundSrcFromFile.startsWith('assets/') ? `../${soundSrcFromFile}` : soundSrcFromFile;

                const buttonTextNode = Array.from(this.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                const baseButtonText = buttonTextNode ? buttonTextNode.textContent.trim() : this.dataset.sound; // Fallback para data-sound
                const iconEl = this.querySelector('i');
                // Tenta pegar o ícone original do dataset, senão pega o atual ou um default
                const originalIconClass = iconEl ? (iconEl.dataset.originalIconClass || iconEl.className) : `fas fa-play-circle`;


                if (currentPlayingAudioButtonCuidador === this) { // Se clicou no botão que já está tocando
                    audioPlayerCuidador.pause();
                    this.classList.remove('playing'); // Supondo que 'playing' controla o estilo do botão ativo
                    if(iconEl) iconEl.className = originalIconClass; // Restaura ícone original
                    //  this.innerHTML = `<i class="${originalIconClass}"></i> ${baseButtonText}`; // Pode ser mais simples só trocar o ícone
                    this.setAttribute('aria-label', `Ouvir ${baseButtonText}`);
                    this.setAttribute('aria-pressed', 'false');
                    currentPlayingAudioButtonCuidador = null;
                    if(window.speakFromReader) window.speakFromReader(`Áudio ${baseButtonText} pausado.`);
                } else { // Clicou em um novo botão ou em um botão pausado
                    // Pausa e reseta o botão anterior, se houver
                    if (currentPlayingAudioButtonCuidador) {
                        audioPlayerCuidador.pause(); // Pausa o áudio que estava tocando
                        const prevBtnTxtNode = Array.from(currentPlayingAudioButtonCuidador.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);
                        const prevBaseTxt = prevBtnTxtNode ? prevBtnTxtNode.textContent.replace('Parar ','').trim() : currentPlayingAudioButtonCuidador.dataset.sound;
                        const prevIcEl = currentPlayingAudioButtonCuidador.querySelector('i');
                        const prevOrigIc = prevIcEl ? (prevIcEl.dataset.originalIconClass || prevIcEl.className) : `fas fa-play-circle`;
                        currentPlayingAudioButtonCuidador.classList.remove('playing');
                        if(prevIcEl) prevIcEl.className = prevOrigIc;
                        // currentPlayingAudioButtonCuidador.innerHTML = `<i class="${prevOrigIc}"></i> ${prevBaseTxt}`;
                        currentPlayingAudioButtonCuidador.setAttribute('aria-label',`Ouvir ${prevBaseTxt}`);
                        currentPlayingAudioButtonCuidador.setAttribute('aria-pressed', 'false');
                    }

                    audioPlayerCuidador.src = soundSrc;
                    audioPlayerCuidador.play()
                        .then(()=>{
                            this.classList.add('playing');
                            if(iconEl){
                                if (!iconEl.dataset.originalIconClass) iconEl.dataset.originalIconClass = originalIconClass; // Salva apenas se não tiver
                                iconEl.className = 'fas fa-stop-circle'; // Muda para ícone de parar
                            }
                            // this.innerHTML = `<i class="fas fa-stop-circle"></i> Parar ${baseButtonText}`;
                            this.setAttribute('aria-label',`Parar som de ${baseButtonText}`);
                            this.setAttribute('aria-pressed', 'true');
                            currentPlayingAudioButtonCuidador = this;
                            if(window.speakFromReader) window.speakFromReader(`Tocando áudio: ${baseButtonText}.`);
                        })
                        .catch(e => {
                            console.error("Nave Azul [Cuidador]: Erro ao tocar áudio:", soundSrc, e);
                            if(window.speakFromReader) window.speakFromReader(`Erro ao tentar tocar o áudio ${baseButtonText}.`);
                            this.classList.remove('playing');
                            if(iconEl) iconEl.className = originalIconClass;
                            // this.innerHTML = `<i class="${originalIconClass}"></i> ${baseButtonText}`;
                            this.setAttribute('aria-pressed', 'false');
                        });
                }
            });
        });

        audioPlayerCuidador.addEventListener('ended', () => {
            if(currentPlayingAudioButtonCuidador){
                const btnTxtNode = Array.from(currentPlayingAudioButtonCuidador.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);
                const baseTxt = btnTxtNode ? btnTxtNode.textContent.replace('Parar ','').trim() : currentPlayingAudioButtonCuidador.dataset.sound;
                const icEl = currentPlayingAudioButtonCuidador.querySelector('i');
                const origIc = icEl ? (icEl.dataset.originalIconClass || icEl.className) : `fas fa-play-circle`;
                currentPlayingAudioButtonCuidador.classList.remove('playing');
                if(icEl) icEl.className = origIc;
                // currentPlayingAudioButtonCuidador.innerHTML = `<i class="${origIc}"></i> ${baseTxt}`;
                currentPlayingAudioButtonCuidador.setAttribute('aria-label',`Ouvir ${baseTxt}`);
                currentPlayingAudioButtonCuidador.setAttribute('aria-pressed', 'false');
                currentPlayingAudioButtonCuidador = null;
            }
        });
    } else if (document.querySelector('.audio-guides-cuidador')) {
         console.warn("Nave Azul [Cuidador]: Botões de áudio ou elemento de áudio não encontrados na seção de autocuidado.");
    }
    // --- FIM: PLAYER DE ÁUDIO ---


    // --- Demais funcionalidades da página do cuidador (placeholders) ---
    // Download de Recursos (Simulação)
    const downloadLinks = document.querySelectorAll('#cuidadorPage .btn-resource[download]');
    if (downloadLinks.length > 0) {
        downloadLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const fileName = this.getAttribute('download') || "documento_nave_azul.pdf";
                if (this.getAttribute('href') === '#' || !this.hasAttribute('href') || this.getAttribute('href').trim() === '') {
                    e.preventDefault();
                    alert(`Simulando download de: "${fileName}"`);
                    if(window.speakFromReader) window.speakFromReader(`Download de ${fileName} iniciado.`);
                } else {
                    console.log(`Nave Azul: Preparando download de ${fileName} a partir de ${this.href}`);
                    if(window.speakFromReader) window.speakFromReader(`Preparando download de ${fileName}.`);
                }
            });
        });
    }

    // Busca de Profissionais (Simulação)
    const professionalSearchInput = document.getElementById('professionalSearchInput');
    const professionalSearchBtn = document.getElementById('professionalSearchBtn');
    function performProfessionalSearch() {
        const searchTerm = professionalSearchInput ? professionalSearchInput.value.trim() : '';
        if (searchTerm) {
            alert(`Simulando busca por profissionais: "${searchTerm}"\n(Resultados apareceriam abaixo)`);
            if(window.speakFromReader) window.speakFromReader(`Buscando por ${searchTerm}.`);
        } else {
            alert('Por favor, digite um termo para buscar.');
            if(window.speakFromReader) window.speakFromReader('Por favor, digite um termo para buscar.');
        }
    }
    if (professionalSearchBtn) professionalSearchBtn.addEventListener('click', performProfessionalSearch);
    if (professionalSearchInput) professionalSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performProfessionalSearch(); });

    // Tooltips (Tippy.js)
    if (typeof tippy === 'function' && document.querySelectorAll('#cuidadorPage [data-tippy-content]').length > 0) {
        tippy('#cuidadorPage [data-tippy-content]', {
            theme: 'nave-azul-tooltip', // Certifique-se de ter um tema CSS para 'nave-azul-tooltip'
            animation: 'scale-subtle',
            duration: [250, 200],
            arrow: true,
            placement: 'top',
            allowHTML: true, // Se o conteúdo do tippy tiver HTML
        });
    }

    console.log("Nave Azul: Interações da Página de Apoio ao Cuidador carregadas.");
};