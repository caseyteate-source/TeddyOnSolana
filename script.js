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

function scrollToBoard() {
  document.getElementById("board").scrollIntoView({
    behavior: "smooth"
  });
}

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

  const scores = [
  "KITTY 74100",
  "TEDDY 42069",
  "GMEBAY 99999",
  "APES 80085"
];

setInterval(() => {
  const board = document.querySelector(".left-score");

  if (!board) return;

  board.innerHTML =
    scores[Math.floor(Math.random() * scores.length)];
}, 2500);
});
