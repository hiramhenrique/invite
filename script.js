const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("confirmModal");
const form = document.getElementById("rsvpForm");
const screenMessage = document.getElementById("screenMessage");

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
    screenMessage.textContent = "Por favor, informe seu nome completo.";
    screenMessage.classList.add("show");
    return;
  }

  if (Number.isNaN(companions) || companions < 0) {
    screenMessage.textContent = "Informe uma quantidade valida de acompanhantes.";
    screenMessage.classList.add("show");
    return;
  }

  screenMessage.textContent = `${fullName}, sua presenca foi confirmada com ${companions} acompanhante(s).`;
  screenMessage.classList.add("show");

  closeModal();
  form.reset();
  form.companions.value = "";
});
