const openCreateButton = document.getElementById("nx-open-create");
const createDialog = document.getElementById("nx-create-dialog");
const cancelCreateButton = document.getElementById("nx-cancel-create");
const createForm = document.getElementById("nx-create-form");
const eventsList = document.getElementById("nx-events-list");
const searchInput = document.getElementById("nx-search-input");
const toast = document.getElementById("nx-toast");

window.nxState = window.nxState || {
  createdCount: 0,
  joinedEvents: new Map()
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("nx-toast-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("nx-toast-visible");
  }, 2600);
}
window.showToast = showToast;

openCreateButton.addEventListener("click", () => {
  createDialog.showModal();
});

cancelCreateButton.addEventListener("click", () => {
  createDialog.close();
  createForm.reset();
});

createDialog.addEventListener("click", (event) => {
  if (event.target === createDialog) {
    createDialog.close();
    createForm.reset();
  }
});

// Buscar eventos en Descubrir
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const cards = eventsList.querySelectorAll(".nx-event-card");

  cards.forEach((card) => {
    const searchableText = (card.dataset.search || card.textContent).toLocaleLowerCase("es");
    card.hidden = !searchableText.includes(query);
  });
});

// Unirse / Cancelar evento y sincronizar con Eventos y Perfil
function toggleEventJoin(card, forceCancel = false) {
  if (!card) return;
  const button = card.querySelector(".nx-join-button");
  const countSpan = card.querySelector(".nx-attendee-count");
  const eventId = card.dataset.eventId;
  const joined = button.dataset.joined === "true";
  const nextJoined = forceCancel ? false : !joined;

  if (joined === nextJoined) return;

  button.dataset.joined = String(nextJoined);
  button.textContent = nextJoined ? "Te has unido" : "Unirse al evento";
  button.classList.toggle("nx-button-joined", nextJoined);

  if (countSpan) {
    let count = parseInt(countSpan.dataset.count || "0", 10);
    count = nextJoined ? count + 1 : Math.max(0, count - 1);
    countSpan.dataset.count = String(count);
    countSpan.textContent = `${count} confirmados`;
  }

  if (nextJoined) {
    window.nxState.joinedEvents.set(eventId, {
      id: eventId,
      title: card.dataset.eventTitle || "Evento NexoU",
      organizer: card.dataset.eventOrganizer || "Comunidad NexoU",
      category: card.dataset.eventCategory || "Evento",
      when: card.dataset.eventWhen || "Próximamente"
    });
    showToast("¡Listo! Tu asistencia quedó marcada y agregada a Eventos.");
  } else {
    window.nxState.joinedEvents.delete(eventId);
    showToast("Has cancelado tu asistencia.");
  }

  if (typeof window.nxSyncProfileAndEvents === "function") {
    window.nxSyncProfileAndEvents();
  }
}
window.nxToggleEventJoin = toggleEventJoin;

document.addEventListener("click", (event) => {
  const button = event.target.closest(".nx-join-button");
  if (!button) return;
  toggleEventJoin(button.closest(".nx-event-card"));
});

function createMetaItem(label, value, isCount = false) {
  const wrapper = document.createElement("div");
  const heading = document.createElement("strong");
  const text = document.createElement("span");
  heading.textContent = label;
  text.textContent = value;
  if (isCount) {
    text.className = "nx-attendee-count";
    text.dataset.count = "0";
  }
  wrapper.append(heading, text);
  return wrapper;
}

function createEventCard({ title, description, category, datePlace }) {
  const authorName = document.getElementById("nx-header-username").textContent || "Brayan Espinoza";
  const eventId = "evt-" + Date.now();
  const card = document.createElement("article");
  card.className = "nx-event-card";
  card.dataset.eventId = eventId;
  card.dataset.eventTitle = title;
  card.dataset.eventOrganizer = authorName;
  card.dataset.eventCategory = category;
  card.dataset.eventWhen = datePlace;
  card.dataset.search = `${title} ${description} ${category} ${datePlace}`;

  const author = document.createElement("div");
  author.className = "nx-event-author";

  const avatar = document.createElement("div");
  avatar.className = "nx-avatar nx-avatar-large";
  const initials = document.createElement("span");
  initials.textContent = "TÚ";
  avatar.appendChild(initials);

  const details = document.createElement("div");
  details.className = "nx-author-details";
  const authorNameEl = document.createElement("strong");
  authorNameEl.textContent = title;
  const authorRole = document.createElement("span");
  authorRole.textContent = `${authorName} · ${category}`;
  details.append(authorNameEl, authorRole);
  author.append(avatar, details);

  const descriptionNode = document.createElement("p");
  descriptionNode.className = "nx-event-description";
  descriptionNode.textContent = description;

  const cover = document.createElement("div");
  cover.className = "nx-event-cover";
  const coverText = document.createElement("span");
  coverText.className = "nx-cover-fallback";
  coverText.textContent = `${category} · NexoU`;
  cover.appendChild(coverText);

  const meta = document.createElement("div");
  meta.className = "nx-event-meta";
  meta.append(
    createMetaItem("Fecha", datePlace),
    createMetaItem("Categoría", category),
    createMetaItem("Asistentes", "0 confirmados", true)
  );

  const footer = document.createElement("div");
  footer.className = "nx-card-footer";
  const joinButton = document.createElement("button");
  joinButton.type = "button";
  joinButton.className = "nx-button nx-button-primary nx-join-button";
  joinButton.textContent = "Unirse al evento";
  footer.appendChild(joinButton);

  card.append(author, descriptionNode, cover, meta, footer);
  return card;
}

createForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(createForm);
  const data = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    datePlace: String(formData.get("datePlace") || "").trim()
  };

  if (!data.title || !data.description || !data.category || !data.datePlace) {
    showToast("Completa todos los campos para crear el evento.");
    return;
  }

  const newCard = createEventCard(data);
  eventsList.prepend(newCard);
  window.nxState.createdCount++;

  if (typeof window.nxSyncProfileAndEvents === "function") {
    window.nxSyncProfileAndEvents();
  }

  createDialog.close();
  createForm.reset();
  searchInput.value = "";
  showToast("Evento creado y publicado en Descubrir.");
});