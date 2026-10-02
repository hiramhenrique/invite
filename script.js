const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("confirmModal");
const form = document.getElementById("rsvpForm");
const resultMessage = document.getElementById("resultMessage");

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullName = form.fullName.value.trim();
  const companions = Number(form.companions.value);

  if (!fullName) {
    resultMessage.textContent = "Por favor, informe seu nome completo.";
    return;
  }

  if (Number.isNaN(companions) || companions < 0) {
    resultMessage.textContent = "Informe uma quantidade valida de acompanhantes.";
    return;
  }

  resultMessage.textContent = `${fullName}, sua presenca foi confirmada com ${companions} acompanhante(s).`;
  form.reset();
  form.companions.value = "0";
});
