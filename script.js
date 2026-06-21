const startScreen = document.getElementById("startScreen");
const siteContent = document.getElementById("siteContent");
const startGameBtn = document.getElementById("startGame");
const enterSiteBtn = document.getElementById("enterSite");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const timelineEmojis = [
  "🐸", "🍦", "💀", "🥴", "🤝", "👌", "💜", "🫡", "😳", "😵‍💫",
  "👀", "🦍", "🚀", "🌕", "💎", "🙌", "🎮", "🧸", "📚", "📦",
  "🇺🇸", "🎤", "🔥", "💥", "🍻", "⏰", "🧩", "🧵", "🕹️", "🎯",
  "👑", "🪄", "🌀", "⚡", "🏴‍☠️"
];

let player = { x: 240, y: 305, w: 44, h: 36, speed: 7 };
let falling = [];
let fud = [];
let collected = 0;
let lives = 3;
let gameRunning = false;
let keys = {};

function enterSite() {
  startScreen.classList.add("hidden");
  siteContent.classList.remove("hidden");
  window.scrollTo(0, 0);
}

enterSiteBtn.addEventListener("click", enterSite);

startGameBtn.addEventListener("click", () => {
  collected = 0;
  lives = 3;
  falling = [];
  fud = [];
  player.x = 240;
  gameRunning = true;
  requestAnimationFrame(gameLoop);
});

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

canvas.addEventListener("touchstart", (e) => {
  const touchX = e.touches[0].clientX;
  const middle = canvas.getBoundingClientRect().left + canvas.offsetWidth / 2;
  keys[touchX < middle ? "ArrowLeft" : "ArrowRight"] = true;
});

canvas.addEventListener("touchend", () => {
  keys["ArrowLeft"] = false;
  keys["ArrowRight"] = false;
});

function spawnItems() {
  if (Math.random() < 0.045 && collected < timelineEmojis.length) {
    falling.push({
      emoji: timelineEmojis[collected],
      x: Math.random() * (canvas.width - 34),
      y: -34,
      size: 32,
      speed: 2.2 + Math.random() * 1.8
    });
  }

  if (Math.random() < 0.022) {
    fud.push({
      emoji: "☠️",
      x: Math.random() * (canvas.width - 34),
      y: -34,
      size: 32,
      speed: 2.8 + Math.random() * 2
    });
  }
}

function drawBackground() {
  ctx.fillStyle = "#020208";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(0,245,255,.13)";
  for (let y = 50; y < canvas.height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,42,163,.2)";
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(canvas.width / 2, 190);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,42,163,.16)";
  ctx.fillRect(0, 0, canvas.width, 48);
}

function drawHUD() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#00f5ff";
  ctx.fillText(`EMOJIS ${collected}/${timelineEmojis.length}`, 14, 30);

  ctx.fillStyle = "#ff2aa3";
  ctx.fillText(`LIVES ${lives}`, canvas.width - 95, 30);
}

function drawPlayer() {
  ctx.font = "40px Arial";
  ctx.fillText("🧸", player.x, player.y + 36);
}

function drawItems() {
  falling.forEach(item => {
    ctx.font = "32px Arial";
    ctx.fillText(item.emoji, item.x, item.y);
  });

  fud.forEach(item => {
    ctx.font = "32px Arial";
    ctx.fillText(item.emoji, item.x, item.y);
  });
}

function collide(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.w > b.x &&
    a.y < b.y + b.size &&
    a.y + a.h > b.y
  );
}

function gameLoop() {
  if (!gameRunning) return;

  drawBackground();

  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  spawnItems();

  falling.forEach(item => item.y += item.speed);
  fud.forEach(item => item.y += item.speed);

  falling = falling.filter(item => {
    if (collide(player, item)) {
      collected++;
      return false;
    }
    return item.y < canvas.height + 40;
  });

  fud = fud.filter(item => {
    if (collide(player, item)) {
      lives--;
      return false;
    }
    return item.y < canvas.height + 40;
  });

  drawItems();
  drawPlayer();
  drawHUD();

  if (collected >= timelineEmojis.length) {
    gameRunning = false;
    modalTitle.textContent = "🎮 EMOJI TIMELINE COMPLETE";
    modalText.textContent = "You collected the full Roaring Kitty emoji quest. Welcome to the $TEDDY board.";
    modal.classList.add("active");
    setTimeout(enterSite, 1400);
    return;
  }

  if (lives <= 0) {
    gameRunning = false;
    modalTitle.textContent = "☠️ FUD GOT YOU";
    modalText.textContent = "Try again or enter the site.";
    modal.classList.add("active");
    return;
  }

  requestAnimationFrame(gameLoop);
}

drawBackground();
drawHUD();
drawPlayer();

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

function copyContract() {
  const contract = document.getElementById("contractAddress").textContent;

  navigator.clipboard.writeText(contract).then(() => {
    modalTitle.textContent = "📋 CONTRACT COPIED";
    modalText.textContent = contract;
    modal.classList.add("active");
  }).catch(() => {
    modalTitle.textContent = "COPY THIS CONTRACT";
    modalText.textContent = contract;
    modal.classList.add("active");
  });
}

document.getElementById("copyContract").addEventListener("click", copyContract);
document.getElementById("copyContractTop").addEventListener("click", copyContract);
