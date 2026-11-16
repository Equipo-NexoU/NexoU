document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('nx-search-input');
  const cards = Array.from(document.querySelectorAll('#module-conocer .nx-person-card'));
  const emptyState = document.getElementById('nxEmptyState');
  const clearSearchBtn = document.getElementById('nxClearSearchBtn');
  const connectButtons = document.querySelectorAll('#module-conocer .nx-btn-connect[data-user]');

  function notify(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    }
  }

  function filterCards() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = (card.getAttribute('data-search') || '') + ' ' + card.innerText.toLowerCase();
      const matches = text.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount++;
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const moduleConocer = document.getElementById('module-conocer');
      if (moduleConocer && !moduleConocer.hidden) {
        filterCards();
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      filterCards();
      if (searchInput) searchInput.focus();
    });
  }

  connectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const userName = btn.getAttribute('data-user');
      const isSent = btn.classList.toggle('nx-btn-connect--sent');

      if (isSent) {
        btn.textContent = 'Solicitud enviada';
        notify(`Solicitud de conexión enviada a ${userName}`);
      } else {
        btn.textContent = 'Conectar';
        notify(`Solicitud cancelada para ${userName}`);
      }
    });
  });
});