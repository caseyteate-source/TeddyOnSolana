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

let player = { x: 240, y: 305, w: 34, h: 28, speed: 7 };
let falling = [];
let fud = [];
let collected = 0;
let lives = 5;
let gameRunning = false;
let keys = {};
let blink = true;

setInterval(() => {
  blink = !blink;
}, 500);

function enterSite() {
  startScreen.classList.add("hidden");
  siteContent.classList.remove("hidden");
  window.scrollTo(0, 0);
}

enterSiteBtn.addEventListener("click", enterSite);

startGameBtn.addEventListener("click", () => {
  collected = 0;
  lives = 5;
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
  if (Math.random() < 0.075 && collected < timelineEmojis.length) {
    falling.push({
      emoji: timelineEmojis[collected],
      x: Math.random() * (canvas.width - 52),
      y: -52,
      size: 30,
      speed: 2.1 + Math.random() * 1.4
    });
  }

  if (Math.random() < 0.012) {
    fud.push({
      emoji: "☠️",
      x: Math.random() * (canvas.width - 48),
      y: -48,
      size: 26,
      speed: 2.4 + Math.random() * 1.4
    });
  }
}

function drawBackground() {
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";

  ctx.fillStyle = "#020208";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(0,245,255,.16)";
  for (let y = 62; y < canvas.height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,42,163,.22)";
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height);
    ctx.lineTo(canvas.width / 2, 190);
    ctx.stroke();
  }
}

function drawHUD() {
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255,42,163,.22)";
  ctx.fillRect(0, 0, canvas.width, 62);

  ctx.font = "16px monospace";
  ctx.fillStyle = "#00f5ff";
  ctx.fillText(`EMOJIS ${collected}/${timelineEmojis.length}`, 14, 24);

  ctx.fillStyle = "#ff2aa3";
  ctx.fillText(`LIVES ${lives}`, canvas.width - 95, 24);

  if (blink) {
    ctx.font = "14px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(
      "← → MOVE • COLLECT EMOJIS • AVOID THE FUD ☠️",
      canvas.width / 2,
      50
    );
    ctx.textAlign = "left";
  }
}

function drawPlayer() {
  ctx.font = "44px Arial";
  ctx.shadowColor = "#00f5ff";
  ctx.shadowBlur = 16;
  ctx.fillText("🧸", player.x, player.y + 36);
  ctx.shadowBlur = 0;
}

function drawItems() {
  falling.forEach(item => {
    ctx.font = "48px Arial";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 18;
    ctx.fillText(item.emoji, item.x, item.y);
    ctx.shadowBlur = 0;
  });

  fud.forEach(item => {
    ctx.font = "44px Arial";
    ctx.shadowColor = "#ff2aa3";
    ctx.shadowBlur = 18;
    ctx.fillText(item.emoji, item.x, item.y);
    ctx.shadowBlur = 0;
  });
}

function hitPlayerWithItem(item, itemSize) {
  const playerBox = {
    x: player.x + 10,
    y: player.y + 12,
    w: player.w,
    h: player.h
  };

  const itemBox = {
    x: item.x + 12,
    y: item.y - itemSize + 12,
    w: itemSize - 18,
    h: itemSize - 18
  };

  return (
    playerBox.x < itemBox.x + itemBox.w &&
    playerBox.x + playerBox.w > itemBox.x &&
    playerBox.y < itemBox.y + itemBox.h &&
    playerBox.y + playerBox.h > itemBox.y
  );
}

function gameLoop() {
  if (!gameRunning) return;

  drawBackground();

  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - 44, player.x));

  spawnItems();

  falling.forEach(item => item.y += item.speed);
  fud.forEach(item => item.y += item.speed);

  falling = falling.filter(item => {
    if (hitPlayerWithItem(item, 48)) {
      collected++;
      return false;
    }
    return item.y < canvas.height + 60;
  });

  fud = fud.filter(item => {
    if (hitPlayerWithItem(item, 44)) {
      lives--;
      return false;
    }
    return item.y < canvas.height + 60;
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
    modalText.textContent = "The FUD skulls got too close. Try again or enter the site.";
    modal.classList.add("active");
    return;
  }

  requestAnimationFrame(gameLoop);
}

drawBackground();
drawPlayer();
drawHUD();

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
