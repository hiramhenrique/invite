const STORAGE_KEY = "guestConfirmations";

const guestListEl = document.getElementById("guestList");
const emptyStateEl = document.getElementById("emptyState");
const totalGuestsEl = document.getElementById("totalGuests");
const totalCompanionsEl = document.getElementById("totalCompanions");
const sendLocationBtn = document.getElementById("sendLocationBtn");
const footerMessage = document.getElementById("footerMessage");

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
      <button class="delete-btn" type="button">Excluir</button>
    </div>

    <div class="guest-info">
      <div class="info-pill"><span class="info-label">Qtd acompanhantes:</span> ${guest.companions}</div>
      <div class="info-pill"><span class="info-label">Nomes:</span> ${companionsNames}</div>
    </div>
  `;

  card.querySelector(".delete-btn").addEventListener("click", () => {
    deleteGuest(guest.id);
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

sendLocationBtn.addEventListener("click", async () => {
  const locationMessage = "Localizacao do evento: https://www.google.com/maps";

  try {
    await navigator.clipboard.writeText(locationMessage);
    footerMessage.textContent = "Mensagem de localizacao copiada. Agora e so enviar para os confirmados.";
  } catch {
    footerMessage.textContent = "Nao foi possivel copiar automaticamente. Mensagem: " + locationMessage;
  }
});

render();
