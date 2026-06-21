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

let player = { x: 190, y: 300, w: 42, h: 28, speed: 7 };
let clues = [];
let fud = [];
let score = 0;
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
  score = 0;
  lives = 3;
  clues = [];
  fud = [];
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
  const canvasMiddle = canvas.getBoundingClientRect().left + canvas.offsetWidth / 2;
  keys[touchX < canvasMiddle ? "ArrowLeft" : "ArrowRight"] = true;
});

canvas.addEventListener("touchend", () => {
  keys["ArrowLeft"] = false;
  keys["ArrowRight"] = false;
});

function spawnItems() {
  if (Math.random() < 0.035) {
    clues.push({
      x: Math.random() * (canvas.width - 28),
      y: -30,
      size: 26,
      speed: 2 + Math.random() * 2
    });
  }

  if (Math.random() < 0.025) {
    fud.push({
      x: Math.random() * (canvas.width - 32),
      y: -30,
      size: 30,
      speed: 2.5 + Math.random() * 2.5
    });
  }
}

function drawPlayer() {
  ctx.font = "34px Arial";
  ctx.fillText("🐻", player.x, player.y + 28);
}

function drawItems() {
  ctx.font = "26px Arial";
  clues.forEach(item => ctx.fillText("🧩", item.x, item.y));
  fud.forEach(item => ctx.fillText("☠️", item.x, item.y));
}

function drawHUD() {
  ctx.fillStyle = "#00f5ff";
  ctx.font = "18px Arial";
  ctx.fillText(`CLUES: ${score}`, 14, 26);
  ctx.fillText(`LIVES: ${lives}`, 320, 26);
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(0,245,255,.15)";
  for (let i = 0; i < canvas.height; i += 28) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  spawnItems();

  clues.forEach(item => item.y += item.speed);
  fud.forEach(item => item.y += item.speed);

  clues = clues.filter(item => {
    if (collide(player, item)) {
      score++;
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

  if (score >= 10) {
    gameRunning = false;
    modalTitle.textContent = "🎮 LEVEL CLEARED";
    modalText.textContent = "You collected the clues. Welcome to the $TEDDY board.";
    modal.classList.add("active");
    setTimeout(enterSite, 1200);
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
