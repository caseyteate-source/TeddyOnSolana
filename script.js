const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

const emojiTimelineHTML = `
  <div class="emoji-timeline-grid">
    <div class="emoji-step"><strong>🐸 Frog:</strong> The meme signal. Something strange begins.</div>
    <div class="emoji-step"><strong>🍦 Ice Cream:</strong> Callback energy. Ryan Cohen lore enters the chat.</div>
    <div class="emoji-step"><strong>💀 Skull:</strong> The old system gets buried.</div>
    <div class="emoji-step"><strong>🇺🇸 Flag:</strong> A bigger market-wide moment approaches.</div>
    <div class="emoji-step"><strong>🎤 Microphone:</strong> The announcement. Someone speaks.</div>
    <div class="emoji-step"><strong>👀 Eyes:</strong> Everyone is watching.</div>
    <div class="emoji-step"><strong>🔥 Fire:</strong> Volume, attention, and chaos.</div>
    <div class="emoji-step"><strong>💥 Explosion:</strong> The breakout moment.</div>
    <div class="emoji-step"><strong>🍻 Cheers:</strong> Community celebration.</div>
  </div>
`;

document.querySelectorAll("[data-title], [data-panel]").forEach((item) => {
  item.addEventListener("click", () => {
    if (item.dataset.panel === "emojiTimeline") {
      modalTitle.textContent = "📈 EMOJI TIMELINE";
      modalText.innerHTML = emojiTimelineHTML;
      modal.classList.add("active");
      return;
    }

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
