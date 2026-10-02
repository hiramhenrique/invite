const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("confirmModal");
const form = document.getElementById("rsvpForm");
const successModal = document.getElementById("successModal");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const successOkBtn = document.getElementById("successOkBtn");
const successMainText = document.getElementById("successMainText");

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

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
closeSuccessBtn.addEventListener("click", closeSuccessModal);
successOkBtn.addEventListener("click", closeSuccessModal);

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
  const companions = Number(form.companions.value);

  if (!fullName || Number.isNaN(companions) || companions < 0) {
    return;
  }

  successMainText.textContent = `${fullName}, sua presenca foi confirmada com ${companions} acompanhante(s).`;

  closeModal();
  openSuccessModal();
  form.reset();
  form.companions.value = "";
});
