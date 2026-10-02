const STORAGE_KEY = "guestConfirmations";

const guestListEl = document.getElementById("guestList");
const emptyStateEl = document.getElementById("emptyState");
const totalGuestsEl = document.getElementById("totalGuests");
const totalCompanionsEl = document.getElementById("totalCompanions");

function getConfirmations() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveConfirmations(confirmations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmations));
}

function deleteGuest(id) {
  const list = getConfirmations().filter((item) => item.id !== id);
  saveConfirmations(list);
  render();
}

async function sendLocationToGuest(guest, messageEl) {
  const locationMessage = `Oi, ${guest.fullName}! Aqui esta a localizacao do evento: https://www.google.com/maps`;

  try {
    await navigator.clipboard.writeText(locationMessage);
    messageEl.textContent = "Mensagem de localizacao copiada. Agora e so enviar para este convidado.";
  } catch {
    messageEl.textContent = "Nao foi possivel copiar automaticamente. Use: " + locationMessage;
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
      <div>
        <h3 class="guest-name">${guest.fullName}</h3>
        <p class="guest-phone">Contato: ${guest.phone}</p>
      </div>
      <div class="guest-actions">
        <button class="send-location-btn" type="button">Enviar localizacao</button>
        <button class="delete-btn" type="button">Excluir</button>
      </div>
    </div>

    <div class="guest-info">
      <div class="info-pill"><span class="info-label">Qtd acompanhantes:</span> ${guest.companions}</div>
      <div class="info-pill"><span class="info-label">Nomes:</span> ${companionsNames}</div>
    </div>
    <p class="guest-message" aria-live="polite"></p>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    deleteGuest(guest.id);
  });

  const messageEl = card.querySelector(".guest-message");
  card.querySelector(".send-location-btn").addEventListener("click", () => {
    sendLocationToGuest(guest, messageEl);
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

function render() {
  const confirmations = getConfirmations();

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

render();
