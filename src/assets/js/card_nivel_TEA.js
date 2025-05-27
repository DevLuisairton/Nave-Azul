// Funcionalidade dos cards de nível TEA
const levelCards = document.querySelectorAll('.level-card');

levelCards.forEach(card => {
  // Clique e Enter/Space para seleção
  const handleSelection = () => {
    const level = card.classList[1]; // suave, medio, ou alto

    // Remove seleção anterior
    levelCards.forEach(c => c.classList.remove('selected'));

    // Adiciona seleção atual
    card.classList.add('selected');

    // Feedback visual temporário
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);

    // Announce para leitores de tela
    announceToScreenReader(`Nível ${level} selecionado`);

    console.log(`Nível selecionado: ${level}`);
  };

  card.addEventListener('click', handleSelection);

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelection();
    }
  });
});