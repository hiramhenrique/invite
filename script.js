import {
  addGuestConfirmation,
  isFirestoreConfigured,
} from "./firestore.js";

const openModalBtn = document.getElementById("openModalBtn");
const openHostPanelBtn = document.getElementById("openHostPanelBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("confirmModal");
const form = document.getElementById("rsvpForm");
const phoneInput = document.getElementById("phone");
const companionsInput = document.getElementById("companions");
const companionsNamesWrap = document.getElementById("companionsNamesWrap");
const companionsNamesInput = document.getElementById("companionsNames");
const successModal = document.getElementById("successModal");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const successOkBtn = document.getElementById("successOkBtn");
const successMainText = document.getElementById("successMainText");
const HOST_PANEL_PASSWORD = "654321";

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function openSuccessModal() {
  successModal.classList.add("show");
  successModal.setAttribute("aria-hidden", "false");
}

function closeSuccessModal() {
  successModal.classList.remove("show");
  successModal.setAttribute("aria-hidden", "true");
}

function syncCompanionsNamesField() {
  const companions = Number(companionsInput.value);
  const shouldShow = Number.isFinite(companions) && companions > 0;

  companionsNamesWrap.hidden = !shouldShow;
  companionsNamesInput.required = shouldShow;

  if (!shouldShow) {
    companionsNamesInput.value = "";
  }
}

openModalBtn.addEventListener("click", openModal);
openHostPanelBtn.addEventListener("click", () => {
  const password = window.prompt("Digite a senha para acessar o painel do anfitrião:");

  if (password === null) {
    return;
  }

  if (password === HOST_PANEL_PASSWORD) {
    window.location.href = "anfitriao.html";
    return;
  }

  window.alert("Senha incorreta.");
});
closeModalBtn.addEventListener("click", closeModal);
closeSuccessBtn.addEventListener("click", closeSuccessModal);
successOkBtn.addEventListener("click", closeSuccessModal);
companionsInput.addEventListener("input", syncCompanionsNamesField);
phoneInput.addEventListener("input", () => {
  phoneInput.setCustomValidity("");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

successModal.addEventListener("click", (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal.classList.contains("show")) {
      closeModal();
    }

    if (successModal.classList.contains("show")) {
      closeSuccessModal();
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const fullName = form.fullName.value.trim();
  const phone = form.phone.value.trim();
  const companions = Number(form.companions.value);
  const companionsNames = companionsNamesInput.value.trim();

  if (!fullName || !phone || Number.isNaN(companions) || companions < 0) {
    return;
  }

  if (companions > 0 && !companionsNames) {
    companionsNamesInput.reportValidity();
    return;
  }

  if (!isFirestoreConfigured()) {
    window.alert("Firestore ainda não está configurado. Preencha as variáveis VITE_FIREBASE_* no arquivo .env.");
    return;
  }

  const parsedCompanionsNames = companionsNames
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter(Boolean);

  try {
    await addGuestConfirmation({
      fullName,
      phone,
      companions,
      companionsNames: parsedCompanionsNames,
    });
  } catch (error) {
    window.alert("Não foi possível confirmar presença agora. Verifique a configuração do Firestore.");
    console.error(error);
    return;
  }

  successMainText.textContent = `${fullName}, sua presença foi confirmada com ${companions} acompanhante(s).`;

  closeModal();
  openSuccessModal();
  form.reset();
  form.companions.value = "";
  syncCompanionsNamesField();
});

syncCompanionsNamesField();
