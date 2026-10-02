import {
  deleteGuestConfirmation,
  isFirestoreConfigured,
  subscribeGuestConfirmations,
} from "./firestore.js";

const guestListEl = document.getElementById("guestList");
const emptyStateEl = document.getElementById("emptyState");
const totalGuestsEl = document.getElementById("totalGuests");
const totalCompanionsEl = document.getElementById("totalCompanions");

async function deleteGuest(id) {
  try {
    await deleteGuestConfirmation(id);
  } catch {
    window.alert("Não foi possível excluir o convidado agora.");
  }
}

async function sendLocationToGuest(guest, messageEl) {
  const locationMessage = `Oi, ${guest.fullName}! Aqui está a localização do evento: https://www.google.com/maps`;

  try {
    await navigator.clipboard.writeText(locationMessage);
    messageEl.textContent = "Mensagem de localização copiada. Agora é só enviar para este convidado.";
  } catch {
    messageEl.textContent = "Não foi possível copiar automaticamente. Use: " + locationMessage;
  }
}

function buildCard(guest) {
  const card = document.createElement("article");
  card.className = "guest-card";

  const companionsNames = Array.isArray(guest.companionsNames) && guest.companionsNames.length > 0
    ? guest.companionsNames.join(", ")
    : "Sem acompanhantes";

  card.innerHTML = `
    <div class="guest-top">
      <h3 class="guest-name">${guest.fullName}</h3>
      <button class="details-btn" type="button" aria-expanded="false">Detalhes</button>
    </div>

    <div class="guest-details" hidden>
      <div class="guest-info">
        <div class="info-pill"><span class="info-label">Contato:</span> ${guest.phone}</div>
        <div class="info-pill"><span class="info-label">Qtd acompanhantes:</span> ${guest.companions}</div>
        <div class="info-pill"><span class="info-label">Nomes:</span> ${companionsNames}</div>
      </div>

      <div class="guest-actions">
        <button class="send-location-btn" type="button">Enviar localização</button>
        <button class="delete-btn" type="button">Excluir</button>
      </div>

      <p class="guest-message" aria-live="polite"></p>
    </div>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    deleteGuest(guest.id);
  });

  const messageEl = card.querySelector(".guest-message");
  card.querySelector(".send-location-btn").addEventListener("click", () => {
    sendLocationToGuest(guest, messageEl);
  });

  const detailsBtn = card.querySelector(".details-btn");
  const detailsPanel = card.querySelector(".guest-details");
  detailsBtn.addEventListener("click", () => {
    const isOpen = !detailsPanel.hidden;
    detailsPanel.hidden = isOpen;
    detailsBtn.setAttribute("aria-expanded", String(!isOpen));
    detailsBtn.textContent = isOpen ? "Detalhes" : "Ocultar";
  });

  return card;
}

function renderSummary(confirmations) {
  totalGuestsEl.textContent = String(confirmations.length);

  const totalCompanions = confirmations.reduce((acc, item) => {
    const qty = Number(item.companions) || 0;
    return acc + qty;
  }, 0);

  totalCompanionsEl.textContent = String(totalCompanions);
}

function render(confirmations) {

  guestListEl.innerHTML = "";
  renderSummary(confirmations);

  if (confirmations.length === 0) {
    emptyStateEl.style.display = "block";
    return;
  }

  emptyStateEl.style.display = "none";
  confirmations.forEach((guest) => {
    guestListEl.appendChild(buildCard(guest));
  });
}

if (!isFirestoreConfigured()) {
  emptyStateEl.style.display = "block";
  emptyStateEl.textContent = "Firestore não configurado. Preencha as variáveis VITE_FIREBASE_* no .env.";
} else {
  subscribeGuestConfirmations(
    (confirmations) => {
      render(confirmations);
    },
    () => {
      emptyStateEl.style.display = "block";
      emptyStateEl.textContent = "Erro ao carregar convidados do Firestore.";
    }
  );
}
