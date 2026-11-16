(() => {
  const modules = {
    conocer: document.getElementById("module-conocer"),
    descubrir: document.getElementById("module-descubrir"),
    eventos: document.getElementById("module-eventos"),
    chats: document.getElementById("module-chats"),
    perfil: document.getElementById("module-perfil")
  };

  function navigateTo(moduleName) {
    if (!modules[moduleName]) {
      if (typeof window.showToast === "function") {
        window.showToast("Este módulo será conectado cuando se integren todas las pantallas.");
      }
      return;
    }

    document.querySelectorAll(".nx-nav-link[data-module]").forEach((link) => {
      link.classList.toggle("nx-nav-link-active", link.dataset.module === moduleName);
    });

    Object.entries(modules).forEach(([key, el]) => {
      if (el) el.hidden = key !== moduleName;
    });

    syncProfileAndEvents();
  }
  window.nxNavigateTo = navigateTo;

  // Enlaces del menú lateral y logo
  document.querySelectorAll(".nx-nav-link[data-module]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(link.dataset.module);
    });
  });

  document.getElementById("nx-brand-home").addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("descubrir");
  });

  // Menú desplegable de usuario en la esquina superior derecha
  const userMenuBtn = document.getElementById("nx-user-menu-btn");
  const userDropdown = document.getElementById("nx-user-dropdown");
  const userWrapper = document.getElementById("nx-user-menu-wrapper");

  function closeDropdown() {
    userDropdown.hidden = true;
    userMenuBtn.setAttribute("aria-expanded", "false");
  }

  userMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !userDropdown.hidden;
    userDropdown.hidden = isOpen;
    userMenuBtn.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!userDropdown.hidden && !userWrapper.contains(e.target)) {
      closeDropdown();
    }
  });

  document.querySelectorAll("[data-dropdown-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.dropdownAction;
      closeDropdown();
      if (action === "perfil") navigateTo("perfil");
      if (action === "eventos") navigateTo("eventos");
      if (action === "settings") settingsDialog.showModal();
      if (action === "logout" && typeof window.nxLogout === "function") window.nxLogout();
    });
  });

  document.getElementById("nx-logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    if (typeof window.nxLogout === "function") window.nxLogout();
  });

  // Sincronización de métricas de Perfil y lista de Eventos inscritos
  function syncProfileAndEvents() {
    const state = window.nxState || { createdCount: 0, joinedEvents: new Map() };

    document.getElementById("nx-stat-created").textContent = String(state.createdCount);
    document.getElementById("nx-stat-attendances").textContent = String(state.joinedEvents.size);

    const emptyBox = document.getElementById("nx-my-events-empty");
    const listBox = document.getElementById("nx-joined-events-list");

    if (state.joinedEvents.size === 0) {
      emptyBox.hidden = false;
      listBox.hidden = true;
      listBox.innerHTML = "";
      return;
    }

    emptyBox.hidden = true;
    listBox.hidden = false;
    listBox.innerHTML = "";

    state.joinedEvents.forEach((evt) => {
      const card = document.createElement("article");
      card.className = "nx-joined-item";
      card.innerHTML = `
        <div class="nx-joined-info">
          <span class="nx-joined-badge">${evt.category}</span>
          <h3>${evt.title}</h3>
          <p class="nx-joined-meta">Organiza: ${evt.organizer} · ${evt.when}</p>
        </div>
        <button type="button" class="nx-btn-cancel-join" data-cancel-id="${evt.id}">Cancelar asistencia</button>
      `;
      listBox.appendChild(card);
    });
  }
  window.nxSyncProfileAndEvents = syncProfileAndEvents;

  document.addEventListener("click", (e) => {
    const cancelBtn = e.target.closest("[data-cancel-id]");
    if (!cancelBtn) return;
    const id = cancelBtn.dataset.cancelId;
    const cardInDiscover = document.querySelector(`.nx-event-card[data-event-id="${id}"]`);
    if (cardInDiscover && typeof window.nxToggleEventJoin === "function") {
      window.nxToggleEventJoin(cardInDiscover, true);
    } else if (window.nxState) {
      window.nxState.joinedEvents.delete(id);
      syncProfileAndEvents();
    }
  });

  // Modal de Configuración de Perfil
  const settingsDialog = document.getElementById("nx-settings-dialog");
  const settingsForm = document.getElementById("nx-settings-form");

  document.getElementById("nx-sidebar-settings").addEventListener("click", (e) => {
    e.preventDefault();
    settingsDialog.showModal();
  });

  document.getElementById("nx-cancel-settings").addEventListener("click", () => {
    settingsDialog.close();
  });

  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("nx-set-name").value.trim();
    const career = document.getElementById("nx-set-career").value.trim();
    const uni = document.getElementById("nx-set-uni").value.trim();
    const bio = document.getElementById("nx-set-bio").value.trim();

    if (!name || !career || !uni || !bio) return;

    document.getElementById("nx-header-username").textContent = name;
    document.getElementById("nx-dropdown-username").textContent = name;
    document.getElementById("nx-profile-name").textContent = name;
    document.getElementById("nx-profile-career").textContent = career;
    document.getElementById("nx-profile-university").textContent = uni;
    document.getElementById("nx-profile-bio").textContent = bio;

    settingsDialog.close();
    if (typeof window.showToast === "function") {
      window.showToast("Perfil actualizado correctamente.");
    }
  });
})();