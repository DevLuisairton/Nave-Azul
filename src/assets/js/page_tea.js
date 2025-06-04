document.addEventListener('DOMContentLoaded', () => {

    // --- Planejador de Missões Diárias ---
    const addRoutineTaskBtn = document.getElementById('addRoutineTaskBtn');
    const routineTaskList = document.getElementById('routineTaskList');
    const currentDateRoutineEl = document.getElementById('currentDateRoutine');
    const routineAreaPlaceholderText = document.querySelector('#routineArea .routine-placeholder-text');

    // Define a data atual no cabeçalho da rotina
    if (currentDateRoutineEl) {
        const today = new Date();
        // Intl.DateTimeFormat para formatação mais robusta e localizada
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        currentDateRoutineEl.textContent = formatter.format(today);
    }

    function updateRoutinePlaceholderVisibility() {
        if (routineAreaPlaceholderText) {
            const tasksExist = routineTaskList.querySelector('.routine-task-item') !== null;
            routineAreaPlaceholderText.style.display = tasksExist ? 'none' : 'block';
        }
    }

    if (addRoutineTaskBtn && routineTaskList) {
        addRoutineTaskBtn.addEventListener('click', () => {
            const taskName = prompt("Digite o nome da nova tarefa cósmica:");
            if (taskName && taskName.trim() !== "") {
                addNewRoutineTask(taskName.trim());
                updateRoutinePlaceholderVisibility();
            }
        });
    }

    function addNewRoutineTask(name, isCompleted = false) {
        const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // ID mais robusto

        const listItem = document.createElement('li');
        listItem.classList.add('routine-task-item');
        if (isCompleted) {
            listItem.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = taskId;
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', handleTaskCompletion);

        const label = document.createElement('label');
        label.htmlFor = taskId;
        // Ícone padrão para novas tarefas. Pode ser alterado ou tornado selecionável no futuro.
        label.innerHTML = `<i class="fas fa-space-shuttle" aria-hidden="true"></i> ${escapeHtml(name)}`;

        const rewardVisual = document.createElement('span');
        rewardVisual.classList.add('task-reward-visual');
        rewardVisual.setAttribute('aria-label', 'Recompensa: Estrela');
        if (isCompleted) {
            rewardVisual.innerHTML = '<i class="fas fa-star" aria-hidden="true"></i>';
        }

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(rewardVisual);

        routineTaskList.appendChild(listItem);
    }

    function handleTaskCompletion(event) {
        const checkbox = event.target;
        const taskItem = checkbox.closest('.routine-task-item');
        if (!taskItem) return;

        if (checkbox.checked) {
            taskItem.classList.add('completed');
            taskItem.querySelector('.task-reward-visual').innerHTML = '<i class="fas fa-star" aria-hidden="true"></i>';
        } else {
            taskItem.classList.remove('completed');
            taskItem.querySelector('.task-reward-visual').innerHTML = '';
        }
    }
    
    // Função para escapar HTML e prevenir XSS simples ao adicionar tarefas
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Adicionar event listeners para tarefas já existentes no HTML (se não forem 'disabled')
    // e atualizar visualização do placeholder.
    if (routineTaskList) {
        routineTaskList.querySelectorAll('.routine-task-item input[type="checkbox"]:not([disabled])').forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskCompletion);
            // Garante que o estado visual inicial esteja correto para tarefas pré-marcadas
            if (checkbox.checked && !checkbox.closest('.routine-task-item').classList.contains('completed')) {
                handleTaskCompletion({ target: checkbox }); // Simula o evento para atualizar
            }
        });
        updateRoutinePlaceholderVisibility(); // Checa ao carregar a página
    }


    // --- Câmara de Serenidade Nebular - Ciclo de Respiração ---
    const breathingCircle = document.getElementById('breathingCircle');
    const breathingGuideTextEl = document.getElementById('breathingGuideText'); // Elemento para "Inspirar", "Segurar", "Expirar"
    const breathingInstructionTextEl = document.getElementById('breathingInstructionText'); // Elemento para a instrução detalhada
    const startStopBreathingBtn = document.getElementById('startStopBreathingBtn');

    let breathingInterval;
    let isBreathingActive = false; // Renomeado para clareza
    const breathCycleConfig = [
        // Duração em milissegundos
        { stateName: 'Inspirar', duration: 4000, instruction: 'Puxe o ar lentamente pelo nariz...', class: 'inhaling' },
        { stateName: 'Segurar', duration: 4000, instruction: 'Mantenha o ar nos pulmões.', class: 'holding' },
        { stateName: 'Expirar', duration: 6000, instruction: 'Solte o ar suavemente pela boca.', class: 'exhaling' },
        { stateName: 'Pausar', duration: 2000, instruction: 'Relaxe antes do próximo ciclo.', class: 'paused-breath' } // Pausa curta entre ciclos
    ];
    let currentBreathStateIndex = 0;

    function executeBreathCycle() {
        if (!isBreathingActive) return;

        const currentState = breathCycleConfig[currentBreathStateIndex];

        if (breathingGuideTextEl) breathingGuideTextEl.textContent = currentState.stateName;
        if (breathingInstructionTextEl) breathingInstructionTextEl.textContent = currentState.instruction;
        
        if (breathingCircle) {
            breathingCircle.className = 'breathing-circle'; // Reset classes anteriores
            breathingCircle.classList.add(currentState.class);
        }

        breathingInterval = setTimeout(() => {
            currentBreathStateIndex = (currentBreathStateIndex + 1) % breathCycleConfig.length;
            if (isBreathingActive) {
                executeBreathCycle();
            }
        }, currentState.duration);
    }

    function startBreathingCycle() {
        isBreathingActive = true;
        if(startStopBreathingBtn) {
            startStopBreathingBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i> Pausar';
            startStopBreathingBtn.setAttribute('aria-label', 'Pausar ciclo de respiração');
        }
        if (breathingCircle) breathingCircle.classList.remove('paused-breath-explicit'); // Remove pausa explícita
        currentBreathStateIndex = 0; // Sempre começa da inspiração
        executeBreathCycle();
    }

    function stopBreathingCycle(explicitPause = true) {
        isBreathingActive = false;
        clearTimeout(breathingInterval);
        if(startStopBreathingBtn) {
            startStopBreathingBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> Iniciar';
            startStopBreathingBtn.setAttribute('aria-label', 'Iniciar ciclo de respiração');
        }
        if (breathingGuideTextEl) breathingGuideTextEl.textContent = explicitPause ? 'Ciclo Pausado' : 'Iniciar Ciclo';
        if (breathingInstructionTextEl) breathingInstructionTextEl.textContent = explicitPause ? 'Clique para retomar.' : 'Sincronize com o universo';
        
        if (breathingCircle) {
            breathingCircle.className = 'breathing-circle'; // Reset classes
            if (explicitPause) {
                breathingCircle.classList.add('paused-breath-explicit'); // Classe para pausa iniciada pelo usuário
            }
        }
    }
    
    // Estado inicial do texto do círculo de respiração (se não estiver definido no HTML)
    if (breathingGuideTextEl && !breathingGuideTextEl.textContent.trim()) {
        breathingGuideTextEl.textContent = "Iniciar Ciclo";
    }
    if (breathingInstructionTextEl && !breathingInstructionTextEl.textContent.trim()) {
        breathingInstructionTextEl.textContent = "Sincronize com o universo";
    }


    if (startStopBreathingBtn && breathingCircle && breathingGuideTextEl && breathingInstructionTextEl) {
        startStopBreathingBtn.addEventListener('click', () => {
            if (isBreathingActive) {
                stopBreathingCycle();
            } else {
                startBreathingCycle();
            }
        });
        
        breathingCircle.addEventListener('click', () => {
             if (isBreathingActive) {
                stopBreathingCycle();
            } else {
                startBreathingCycle();
            }
        });

        breathingCircle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (isBreathingActive) {
                    stopBreathingCycle();
                } else {
                    startBreathingCycle();
                }
            }
        });
    }


    // --- Câmara de Serenidade Nebular - Transmissor de Ecos Estelares ---
    const audioButtons = document.querySelectorAll('.audio-button');
    const audioElement = document.getElementById('audioElement');
    let currentlyPlayingButton = null;

    if (audioButtons.length > 0 && audioElement) {
        audioButtons.forEach(button => {
            button.addEventListener('click', () => {
                const soundSrc = button.dataset.src;
                const isThisButtonPlaying = button === currentlyPlayingButton;

                // Se outro botão estava tocando, para ele e remove a classe
                if (currentlyPlayingButton && currentlyPlayingButton !== button) {
                    currentlyPlayingButton.classList.remove('playing');
                    // Atualizar ícone para 'play' no botão anterior se houver
                    const prevIcon = currentlyPlayingButton.querySelector('i');
                    if (prevIcon) {
                        prevIcon.classList.remove('fa-pause-circle'); // Exemplo, use o ícone de play que você definiu
                        prevIcon.classList.add('fa-play-circle'); // Exemplo
                    }
                }
                
                if (isThisButtonPlaying) { // Botão clicado é o que está tocando: Pausa
                    audioElement.pause();
                    button.classList.remove('playing');
                    currentlyPlayingButton = null;
                    // Atualizar ícone para 'play'
                     const icon = button.querySelector('i');
                     if (icon) {
                         icon.classList.remove('fa-pause-circle'); // Exemplo
                         icon.classList.add('fa-play-circle'); // Exemplo
                     }

                } else { // Novo som ou som pausado é clicado: Toca
                    audioElement.src = soundSrc;
                    audioElement.play()
                        .then(() => {
                            button.classList.add('playing');
                            currentlyPlayingButton = button;
                            // Atualizar ícone para 'pause'
                            const icon = button.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-play-circle'); // Exemplo
                                icon.classList.add('fa-pause-circle'); // Exemplo
                            }
                        })
                        .catch(error => {
                            console.error("Erro ao tocar o áudio:", error.message);
                            // Remover classe 'playing' se falhar
                            button.classList.remove('playing');
                            if(currentlyPlayingButton === button) currentlyPlayingButton = null;
                        });
                }
            });
        });

        audioElement.addEventListener('ended', () => {
            if (currentlyPlayingButton) {
                currentlyPlayingButton.classList.remove('playing');
                // Atualizar ícone para 'play' no botão que terminou
                 const icon = currentlyPlayingButton.querySelector('i');
                 if (icon) {
                     icon.classList.remove('fa-pause-circle'); // Exemplo
                     icon.classList.add('fa-play-circle'); // Exemplo
                 }
                currentlyPlayingButton = null;
            }
        });

        audioElement.addEventListener('error', (e) => {
            console.error("Erro no elemento de áudio:", e);
            if (currentlyPlayingButton) {
                currentlyPlayingButton.classList.remove('playing');
                 const icon = currentlyPlayingButton.querySelector('i');
                 if (icon) {
                     icon.classList.remove('fa-pause-circle'); 
                     icon.classList.add('fa-play-circle'); 
                 }
                currentlyPlayingButton = null;
            }
            // Poderia exibir uma mensagem para o usuário aqui.
        });
    }
});