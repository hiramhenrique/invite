const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("confirmModal");
const form = document.getElementById("rsvpForm");
const companionsInput = document.getElementById("companions");
const companionsNamesWrap = document.getElementById("companionsNamesWrap");
const companionsNamesInput = document.getElementById("companionsNames");
const successModal = document.getElementById("successModal");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const successOkBtn = document.getElementById("successOkBtn");
const successMainText = document.getElementById("successMainText");
const STORAGE_KEY = "guestConfirmations";

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

function saveConfirmation(confirmation) {
  const list = getConfirmations();
  list.push(confirmation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

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
closeModalBtn.addEventListener("click", closeModal);
closeSuccessBtn.addEventListener("click", closeSuccessModal);
successOkBtn.addEventListener("click", closeSuccessModal);
companionsInput.addEventListener("input", syncCompanionsNamesField);

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

form.addEventListener("submit", (event) => {
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

  const parsedCompanionsNames = companionsNames
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter(Boolean);

  saveConfirmation({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fullName,
    phone,
    companions,
    companionsNames: parsedCompanionsNames,
  });

  successMainText.textContent = `${fullName}, sua presenca foi confirmada com ${companions} acompanhante(s).`;

  closeModal();
  openSuccessModal();
  form.reset();
  form.companions.value = "";
  syncCompanionsNamesField();
});

syncCompanionsNamesField();
