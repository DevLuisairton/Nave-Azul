// src/assets/js/pages/page_tea.js
window.initTeaPage = function() { // <<<<<< MUDANÇA AQUI
    console.log("Nave Azul: Inicializando interações do Módulo de Exploração...");

    // --- 1. JOGO DE RECONHECIMENTO EMOCIONAL ---
    // ... (todo o código do jogo de emoções) ...
    const emotionImageEl = document.getElementById('emotionImage');
    const emotionGameInstructionEl = document.getElementById('emotionGameInstruction');
    const emotionOptionBtns = document.querySelectorAll('#emotionGames .emotion-option-btn');
    const emotionGameFeedbackEl = document.getElementById('emotionGameFeedback');
    const emotionGameScoreEl = document.getElementById('emotionGameScore');

    const emotionsData = [
        { img: 'https://via.placeholder.com/200x200/0C1627/FFD700?text=Feliz+:D', correctEmotion: 'alegria', alt: 'Rosto sorrindo representando alegria' },
        { img: 'https://via.placeholder.com/200x200/0C1627/ADD8E6?text=Triste+:(', correctEmotion: 'tristeza', alt: 'Rosto triste representando tristeza' },
        { img: 'https://via.placeholder.com/200x200/0C1627/FF6347?text=Raiva+>:O', correctEmotion: 'raiva', alt: 'Rosto zangado representando raiva' },
        { img: 'https://via.placeholder.com/200x200/0C1627/90EE90?text=Surpresa+O.O', correctEmotion: 'surpresa', alt: 'Rosto surpreso representando surpresa' }
    ];
    let currentEmotionIndex = 0;
    let emotionGameScore = 0;

    function loadEmotionChallenge() {
        if (!emotionImageEl || !emotionGameInstructionEl || !emotionGameFeedbackEl) {
            return;
        }
        const emotionOptionsContainer = document.querySelector('#emotionGames .emotion-options');

        if (currentEmotionIndex >= emotionsData.length) {
            emotionGameInstructionEl.textContent = "Fim do desafio de emoções! Ótima exploração!";
            emotionImageEl.style.display = 'none';
            if (emotionOptionsContainer) emotionOptionsContainer.style.display = 'none';
            emotionGameFeedbackEl.textContent = `Pontuação final: ${emotionGameScore} de ${emotionsData.length * 10} estrelas!`;
            if(window.speakFromReader) window.speakFromReader(`Fim do desafio de emoções! Pontuação final: ${emotionGameScore} de ${emotionsData.length * 10} estrelas!`);
            return;
        }
        
        if (emotionOptionsContainer) emotionOptionsContainer.style.display = 'flex';
        const currentChallenge = emotionsData[currentEmotionIndex];
        emotionImageEl.src = currentChallenge.img;
        emotionImageEl.alt = currentChallenge.alt;
        emotionImageEl.style.display = 'block';
        emotionGameInstructionEl.textContent = "Qual emoção este avatar está sentindo?";
        emotionGameFeedbackEl.textContent = "Selecione uma emoção!";
        emotionGameFeedbackEl.style.color = 'inherit';
    }

    if (emotionOptionBtns.length > 0) {
        emotionOptionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (currentEmotionIndex >= emotionsData.length || !emotionGameFeedbackEl || !emotionGameScoreEl) return;

                const selectedEmotion = this.dataset.emotion;
                const correctEmotion = emotionsData[currentEmotionIndex].correctEmotion;
                let feedbackText = "";

                if (selectedEmotion === correctEmotion) {
                    emotionGameScore += 10;
                    feedbackText = "Correto! Você identificou a emoção. Ganhou 10 estrelas!";
                    emotionGameFeedbackEl.style.color = 'var(--success, #48BB78)';
                } else {
                    feedbackText = `Hmm, essa não foi a emoção. A emoção correta era ${correctEmotion}. Tente a próxima!`;
                    emotionGameFeedbackEl.style.color = 'var(--error, #F56565)';
                }
                emotionGameFeedbackEl.textContent = feedbackText;
                emotionGameScoreEl.textContent = emotionGameScore;
                if(window.speakFromReader) window.speakFromReader(feedbackText);

                currentEmotionIndex++;
                emotionOptionBtns.forEach(b => b.disabled = true);
                setTimeout(() => {
                    loadEmotionChallenge();
                    emotionOptionBtns.forEach(b => b.disabled = false);
                }, 2800);
            });
        });
        // A inicialização de loadEmotionChallenge() é feita quando a função initTeaPage é chamada
    } else if (document.getElementById('emotionGames')) {
        console.warn("Nave Azul: Botões de opção do jogo de emoção não encontrados.");
    }

    // --- 2. ROTINAS INTERATIVAS (CHECKLIST VISUAL) ---
    // ... (código das rotinas como na resposta anterior) ...
    const routineTaskListEl = document.getElementById('routineTaskList');
    const addRoutineTaskBtn = document.getElementById('addRoutineTaskBtn');
    const currentDateRoutineEl = document.getElementById('currentDateRoutine');
    const ROUTINE_STORAGE_KEY = 'naveAzulUserRoutines';
    let userRoutines = [];

    function saveRoutines() {
        try { localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(userRoutines)); }
        catch (e) { console.error("Nave Azul: Erro ao salvar rotinas.", e); }
    }

    function loadRoutines() {
        if (!routineTaskListEl) return;
        try {
            const storedRoutines = localStorage.getItem(ROUTINE_STORAGE_KEY);
            if (storedRoutines) userRoutines = JSON.parse(storedRoutines);
            else {
                userRoutines = [
                    { id: Date.now() + 1, text: "Acordar e espreguiçar como um astronauta", icon: "fa-bed-front", completed: false },
                    { id: Date.now() + 2, text: "Tomar Café da Manhã Cósmico", icon: "fa-mug-saucer", completed: false },
                    { id: Date.now() + 3, text: "Escovar os dentes (preparar para gravidade zero!)", icon: "fa-tooth", completed: false }
                ];
            }
        } catch (e) {
            console.error("Nave Azul: Erro ao carregar rotinas.", e); userRoutines = [];
        }
        renderRoutines();
    }

    function renderRoutines() {
        if (!routineTaskListEl) return;
        routineTaskListEl.innerHTML = '';
        if (userRoutines.length === 0) {
            routineTaskListEl.innerHTML = '<li class="routine-empty-state">Nenhuma missão para hoje. Adicione uma! <i class="fas fa-meteor"></i></li>';
            return;
        }
        userRoutines.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('routine-task-item');
            if (task.completed) li.classList.add('completed');
            li.dataset.taskId = task.id;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.id = `task-${task.id}`; checkbox.checked = task.completed;
            checkbox.setAttribute('aria-labelledby', `label-task-${task.id}`);
            checkbox.addEventListener('change', () => toggleRoutineTask(task.id));
            const label = document.createElement('label');
            label.htmlFor = `task-${task.id}`; label.id = `label-task-${task.id}`;
            const iconEl = document.createElement('i');
            iconEl.className = `fas ${task.icon || 'fa-space-shuttle'}`;
            label.appendChild(iconEl); label.appendChild(document.createTextNode(` ${task.text}`));
            const rewardVisual = document.createElement('span');
            rewardVisual.className = 'task-reward-visual';
            if (task.completed) rewardVisual.innerHTML = '<i class="fas fa-star"></i>';
            li.appendChild(checkbox); li.appendChild(label); li.appendChild(rewardVisual);
            routineTaskListEl.appendChild(li);
        });
    }

    function addRoutineTaskFromPrompt() {
        const newTaskText = prompt("Descreva sua nova tarefa espacial:", "Explorar novo quadrante");
        if (newTaskText && newTaskText.trim() !== "") {
            const icons = ["fa-rocket", "fa-user-astronaut", "fa-book", "fa-pencil-alt", "fa-seedling", "fa-lightbulb", "fa-atom", "fa-meteor"];
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            userRoutines.push({ id: Date.now(), text: newTaskText.trim(), icon: randomIcon, completed: false });
            saveRoutines(); renderRoutines();
            if(window.speakFromReader) window.speakFromReader(`Tarefa "${newTaskText.trim()}" adicionada.`);
        }
    }

    function toggleRoutineTask(taskId) {
        const task = userRoutines.find(t => t.id === Number(taskId));
        if (task) {
            task.completed = !task.completed;
            saveRoutines(); renderRoutines();
            if(window.speakFromReader) window.speakFromReader(`Tarefa "${task.text}" marcada como ${task.completed ? 'concluída' : 'pendente'}. ${task.completed ? 'Excelente, Comandante!' : ''}`);
            if (task.completed) playSimpleSoundForRoutine('../assets/sounds/reward_ping.mp3'); // Ajustado caminho
        }
    }
    let simpleAudioCtxForRoutine;
    function playSimpleSoundForRoutine(src) { // Renomeado para evitar conflito com outro playSimpleSound
        try {
            if (!simpleAudioCtxForRoutine) simpleAudioCtxForRoutine = new (window.AudioContext || window.webkitAudioContext)();
            const sound = new Audio(src); sound.volume = 0.2;
            sound.play().catch(e => console.warn("Nave Azul: Não foi possível tocar som de recompensa.", src, e));
        } catch (e) { console.warn("Nave Azul: API de Áudio não suportada ou erro.", e); }
    }

    if (addRoutineTaskBtn) addRoutineTaskBtn.addEventListener('click', addRoutineTaskFromPrompt);
    if (currentDateRoutineEl) {
        try { currentDateRoutineEl.textContent = new Date().toLocaleDateString('pt-BR', {day: 'numeric', month: 'long' }); }
        catch(e) { console.error("Erro ao formatar data: ", e); currentDateRoutineEl.textContent = "Hoje";}
    }


    // --- 3. ZONA DO SILÊNCIO (Respiração e Áudio) ---
    // ... (código da respiração como na resposta anterior) ...
    const breathingCircleEl = document.getElementById('breathingCircle');
    const startStopBreathingBtnEl = document.getElementById('startStopBreathingBtn');
    const breathingGuideTextEl = document.getElementById('breathingGuideText');
    const breathingInstructionTextEl = document.getElementById('breathingInstructionText');
    let isBreathingActive = false; let breathCycleTimeoutId;
    const breathCycleDefinition = [
        { phase: "Inspire", duration: 4000, instruction: "Puxe o ar profundamente...", cssClass: 'inhaling' },
        { phase: "Segure", duration: 4500, instruction: "Mantenha o ar, sinta a calma...", cssClass: 'holding' },
        { phase: "Expire", duration: 6500, instruction: "Solte o ar lentamente...", cssClass: 'exhaling' },
        { phase: "Pause", duration: 2500, instruction: "Relaxe e prepare-se...", cssClass: 'paused-breath' }
    ];
    let currentBreathPhaseIndex = 0;

    function updateBreathingVisualsAndText() {
        if (!breathingCircleEl || !breathingGuideTextEl || !breathingInstructionTextEl || !startStopBreathingBtnEl) return;
        if (!isBreathingActive) {
            breathingCircleEl.className = 'breathing-circle';
            breathingGuideTextEl.textContent = "Iniciar Ciclo";
            breathingInstructionTextEl.textContent = "Sincronize com o universo";
            startStopBreathingBtnEl.innerHTML = '<i class="fas fa-play"></i> Iniciar';
            startStopBreathingBtnEl.setAttribute('aria-label', 'Iniciar exercício de respiração');
            breathingCircleEl.setAttribute('aria-label', 'Círculo de respiração. Toque para iniciar.');
            return;
        }
        const currentPhase = breathCycleDefinition[currentBreathPhaseIndex];
        breathingGuideTextEl.textContent = currentPhase.phase;
        breathingInstructionTextEl.textContent = currentPhase.instruction;
        breathingCircleEl.className = 'breathing-circle breathing';
        breathingCircleEl.classList.add(currentPhase.cssClass);
        startStopBreathingBtnEl.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        startStopBreathingBtnEl.setAttribute('aria-label', 'Pausar exercício de respiração');
        breathingCircleEl.setAttribute('aria-label', `Fase: ${currentPhase.phase}. Toque para pausar.`);
        if(window.speakFromReader) window.speakFromReader(`${currentPhase.phase}. ${currentPhase.instruction}`);
        clearTimeout(breathCycleTimeoutId);
        breathCycleTimeoutId = setTimeout(() => {
            if(breathingCircleEl) breathingCircleEl.classList.remove(currentPhase.cssClass);
            currentBreathPhaseIndex = (currentBreathPhaseIndex + 1) % breathCycleDefinition.length;
            if (isBreathingActive) updateBreathingVisualsAndText();
        }, currentPhase.duration);
    }
    function toggleBreathingCycle() {
        isBreathingActive = !isBreathingActive; clearTimeout(breathCycleTimeoutId);
        if (isBreathingActive) currentBreathPhaseIndex = 0;
        updateBreathingVisualsAndText();
        if (!isBreathingActive && window.speakFromReader) window.speakFromReader("Exercício de respiração pausado.");
    }
    if (breathingCircleEl && startStopBreathingBtnEl) {
        breathingCircleEl.addEventListener('click', toggleBreathingCycle);
        startStopBreathingBtnEl.addEventListener('click', toggleBreathingCycle);
        updateBreathingVisualsAndText(); // Estado inicial do botão
    }

    // ... (código dos Sons Calmantes como na resposta anterior, ajustando caminhos de som) ...
    const audioButtons = document.querySelectorAll('#quietZone .audio-button');
    const audioElement = document.getElementById('audioElement');
    let currentPlayingAudioButton = null;
    if (audioButtons.length > 0 && audioElement) {
        audioButtons.forEach(button => {
            button.addEventListener('click', function() {
                const soundSrcFromFile = this.dataset.src;
                // Ajusta o caminho para MPA se o script está em pages/page_tea.js e sounds em assets/sounds
                const soundSrc = soundSrcFromFile.startsWith('assets/') ? `../${soundSrcFromFile}` : soundSrcFromFile;

                const buttonTextNode = Array.from(this.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                const baseButtonText = buttonTextNode ? buttonTextNode.textContent.trim() : this.dataset.sound;
                const iconEl = this.querySelector('i');
                const originalIconClass = iconEl ? (iconEl.dataset.originalIconClass || iconEl.className) : `fas fa-${getIconForSound(this.dataset.sound)}`;

                if (currentPlayingAudioButton === this) { /* ... lógica de pausar ... */
                    audioElement.pause(); this.classList.remove('playing');
                    if(iconEl) iconEl.className = originalIconClass;
                    this.innerHTML = `<i class="${originalIconClass}"></i> ${baseButtonText}`;
                    this.setAttribute('aria-label', `Ouvir ${baseButtonText}`); currentPlayingAudioButton = null;
                    if(window.speakFromReader) window.speakFromReader(`Som de ${baseButtonText} pausado.`);
                } else { /* ... lógica de tocar ... */
                    if (currentPlayingAudioButton) { /* ... parar som anterior ... */
                        audioElement.pause();
                        const prevBtnTxtNd = Array.from(currentPlayingAudioButton.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);
                        const prevBsTxt = prevBtnTxtNd ? prevBtnTxtNd.textContent.replace('Parar ','').trim() : currentPlayingAudioButton.dataset.sound;
                        const prevIcEl = currentPlayingAudioButton.querySelector('i');
                        const prevOrigIc = prevIcEl ? (prevIcEl.dataset.originalIconClass || prevIcEl.className) : `fas fa-${getIconForSound(currentPlayingAudioButton.dataset.sound)}`;
                        currentPlayingAudioButton.classList.remove('playing');
                        if(prevIcEl) prevIcEl.className = prevOrigIcon;
                        currentPlayingAudioButton.innerHTML = `<i class="${prevOrigIcon}"></i> ${prevBsTxt}`;
                        currentPlayingAudioButton.setAttribute('aria-label',`Ouvir ${prevBsTxt}`);
                    }
                    audioElement.src = soundSrc; audioElement.play()
                        .then(()=>{
                            this.classList.add('playing');
                            if(iconEl){iconEl.dataset.originalIconClass = originalIconClass; iconEl.className = 'fas fa-stop-circle';}
                            this.innerHTML = `<i class="fas fa-stop-circle"></i> Parar ${baseButtonText}`;
                            this.setAttribute('aria-label',`Parar som de ${baseButtonText}`); currentPlayingAudioButton = this;
                            if(window.speakFromReader) window.speakFromReader(`Tocando som de ${baseButtonText}.`);
                        }).catch(e=>{console.error("Erro ao tocar áudio:",soundSrc,e);if(window.speakFromReader)window.speakFromReader(`Erro ao tocar ${baseButtonText}.`);this.classList.remove('playing');if(iconEl)iconEl.className=originalIconClass;this.innerHTML=`<i class="${originalIconClass}"></i> ${baseButtonText}`;});
                }
            });
        });
        audioElement.addEventListener('ended', () => { /* ... lógica de ended ... */
            if(currentPlayingAudioButton){
                const btnTxtNd = Array.from(currentPlayingAudioButton.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);
                const bsTxt = btnTxtNode ? btnTxtNd.textContent.replace('Parar ','').trim() : currentPlayingAudioButton.dataset.sound;
                const icEl = currentPlayingAudioButton.querySelector('i');
                const origIc = icEl ? (icEl.dataset.originalIconClass || icEl.className) : `fas fa-${getIconForSound(currentPlayingAudioButton.dataset.sound)}`;
                currentPlayingAudioButton.classList.remove('playing'); if(icEl)icEl.className = origIc;
                currentPlayingAudioButton.innerHTML = `<i class="${origIc}"></i> ${bsTxt}`;
                currentPlayingAudioButton.setAttribute('aria-label',`Ouvir ${bsTxt}`); currentPlayingAudioButton = null;
            }
        });
    }
    function getIconForSound(soundName) { const map={'rain':'cloud-rain','forest':'pastafarianism','meditation':'om','waves':'water'}; return map[soundName]||'music';}


    // --- 4. JOGO DE SEQUÊNCIA LÓGICA (Placeholder) ---
    if (document.getElementById('logicGameArea')) console.log("Nave Azul: Placeholder Jogo de Sequência Lógica pronto.");

    // --- 5. COMUNICAÇÃO ALTERNATIVA ---
    // ... (código da comunicação alternativa como na resposta anterior) ...
    const commCardBtns = document.querySelectorAll('#communicationBoard .comm-card-btn');
    if (commCardBtns.length > 0) {
        commCardBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const mainTextNode = Array.from(this.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                const textToSpeak = mainTextNode ? mainTextNode.textContent.trim() : (this.querySelector('h4') ? this.querySelector('h4').textContent.trim() : this.innerText.trim());
                if (textToSpeak && window.speakFromReader) window.speakFromReader(textToSpeak);
            });
        });
    }

    // --- 6. DESAFIOS SENSORIAIS (Placeholder) ---
    if (document.getElementById('sensoryChallengeArea')) console.log("Nave Azul: Placeholder Desafios Sensoriais pronto.");

    // --- Dicionário Visual ---
    // ... (código do dicionário visual como na resposta anterior) ...
    const symbolCards = document.querySelectorAll('#symbolsTitleExisting ~ .symbols-grid .symbol-card');
    if (symbolCards.length > 0) {
        symbolCards.forEach(card => {
            card.addEventListener('click', function() {
                const wasActive = this.classList.contains('active');
                symbolCards.forEach(c => c.classList.remove('active'));
                if (!wasActive) {
                    this.classList.add('active');
                    const textToRead = this.dataset.textToRead || this.querySelector('h4').textContent;
                    if(window.speakFromReader) window.speakFromReader(textToRead);
                }
            });
            card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }});
        });
    }

    // Chamadas de inicialização que dependem de elementos específicos desta página
    if (document.getElementById('emotionGames')) loadEmotionChallenge();
    if (document.getElementById('interactiveRoutines')) loadRoutines();
    if (breathingCircleEl && startStopBreathingBtnEl) updateBreathingVisualsAndText(); // Configura estado inicial do botão de respiração


    console.log("Nave Azul: Interações do Módulo de Exploração totalmente carregadas!");
};