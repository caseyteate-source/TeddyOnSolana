const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

document.querySelectorAll("[data-title]").forEach((item) => {
  item.addEventListener("click", () => {
    modalTitle.textContent = item.dataset.title;
    modalText.textContent = item.dataset.text;
    modal.classList.add("active");
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});

document.getElementById("copyContract").addEventListener("click", async () => {
  const contract = document.getElementById("contractAddress").textContent;

  try {
    await navigator.clipboard.writeText(contract);
    modalTitle.textContent = "📋 CONTRACT COPIED";
    modalText.textContent = contract;
    modal.classList.add("active");
  } catch {
    modalTitle.textContent = "COPY THIS CONTRACT";
    modalText.textContent = contract;
    modal.classList.add("active");
  }
});

const konami = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

let input = [];

window.addEventListener("keydown", (event) => {
  input.push(event.key);
  input = input.slice(-konami.length);

  if (input.join("") === konami.join("")) {
    modalTitle.textContent = "🎮 SECRET LEVEL UNLOCKED";
    modalText.textContent = "GMEBAY.exe loaded. The board is alive.";
    modal.classList.add("active");
  }
});
