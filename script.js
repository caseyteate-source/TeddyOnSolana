/* ======================================================
   $TEDDY ARCADE + MAIN SITE SCRIPT
   Safe recovery version
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("startScreen");
  const siteContent = document.getElementById("siteContent");
  const startGameBtn =
    document.getElementById("startGame") ||
    document.getElementById("startGameBtn");
  const enterSiteBtn =
    document.getElementById("enterSite") ||
    document.getElementById("enterSiteBtn");

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let animationFrame = null;
  let gameRunning = false;
  let gameWon = false;
  let score = 0;
  let lives = 3;
  let keys = {};

  const player = {
    x: 120,
    y: 260,
    size: 42,
    speed: 5
  };

  const emojisToCollect = [
    "🐶", "🇺🇸", "🎤", "👀", "🔥", "💥", "🍻",
    "💜", "🕹️", "🍿", "🚀", "🌕", "💎", "🧸"
  ];

  let collectibles = [];
  let enemies = [];
  let particles = [];
  let spawnTimer = 0;

  function resizeCanvas() {
    if (!canvas) return;

    const parentWidth = canvas.parentElement
      ? canvas.parentElement.clientWidth
      : 900;

    canvas.width = Math.min(900, Math.max(320, parentWidth));
    canvas.height = Math.round(canvas.width * 0.56);

    player.x = Math.max(60, Math.min(player.x, canvas.width - 60));
    player.y = Math.max(60, Math.min(player.y, canvas.height - 60));
  }

  function showElement(el) {
    if (!el) return;
    el.classList.remove("hidden");
    el.style.display = "";
  }

  function hideElement(el) {
    if (!el) return;
    el.classList.add("hidden");
  }

  function enterSite() {
    gameRunning = false;

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    hideElement(startScreen);

    if (siteContent) {
      showElement(siteContent);
      window.scrollTo(0, 0);
    } else {
      window.location.href = "hq.html";
    }
  }

  function resetGame() {
    resizeCanvas();

    gameRunning = true;
    gameWon = false;
    score = 0;
    lives = 3;
    spawnTimer = 0;
    collectibles = [];
    enemies = [];
    particles = [];

    player.x = canvas.width * 0.16;
    player.y = canvas.height * 0.5;

    const usableWidth = canvas.width - 130;
    const usableHeight = canvas.height - 110;

    emojisToCollect.forEach((emoji, index) => {
      collectibles.push({
        emoji,
        x: 120 + Math.random() * usableWidth,
        y: 70 + Math.random() * usableHeight,
        size: 32,
        collected: false,
        pulse: Math.random() * Math.PI * 2
      });
    });

    for (let i = 0; i < 5; i++) {
      enemies.push(createEnemy());
    }
  }

  function createEnemy() {
    if (!canvas) {
      return {
        x: 0,
        y: 0,
        size: 32,
        speedX: 2,
        speedY: 1.5
      };
    }

    const side = Math.random() > 0.5 ? "right" : "top";

    if (side === "right") {
      return {
        x: canvas.width + 40,
        y: 40 + Math.random() * (canvas.height - 80),
        size: 34,
        speedX: -(1.6 + Math.random() * 2.4),
        speedY: -1.4 + Math.random() * 2.8
      };
    }

    return {
      x: 40 + Math.random() * (canvas.width - 80),
      y: -40,
      size: 34,
      speedX: -1.5 + Math.random() * 3,
      speedY: 1.5 + Math.random() * 2.2
    };
  }

  function startGame() {
    if (!canvas || !ctx) {
      enterSite();
      return;
    }

    showElement(startScreen);

    if (siteContent) {
      hideElement(siteContent);
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    resetGame();
    drawGame();
  }

  function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#080014");
    gradient.addColorStop(0.5, "#120025");
    gradient.addColorStop(1, "#001425");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(0, 245, 255, 0.18)";
    ctx.lineWidth = 1;

    for (let x = 0; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for (let y = 0; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 42, 163, 0.10)";
    ctx.fillRect(0, h - 64, w, 64);
  }

  function drawText() {
    ctx.save();

    ctx.font = "16px Arial, sans-serif";
    ctx.fillStyle = "#00f5ff";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 12;
    ctx.fillText(`EMOJIS: ${score}/${emojisToCollect.length}`, 18, 28);

    ctx.fillStyle = "#ff2aa3";
    ctx.shadowColor = "#ff2aa3";
    ctx.fillText(`LIVES: ${lives}`, 18, 54);

    ctx.fillStyle = "#ffea00";
    ctx.shadowColor = "#ffea00";
    ctx.fillText("AVOID THE FUD ☠️", canvas.width - 180, 28);

    ctx.restore();
  }

  function drawPlayer() {
    ctx.save();

    ctx.font = `${player.size}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#ff2aa3";
    ctx.shadowBlur = 18;
    ctx.fillText("🧸", player.x, player.y);

    ctx.restore();
  }

  function drawCollectibles() {
    collectibles.forEach((item) => {
      if (item.collected) return;

      item.pulse += 0.08;
      const pulseSize = item.size + Math.sin(item.pulse) * 4;

      ctx.save();
      ctx.font = `${pulseSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 14;
      ctx.fillText(item.emoji, item.x, item.y);
      ctx.restore();
    });
  }

  function drawEnemies() {
    enemies.forEach((enemy) => {
      ctx.save();
      ctx.font = `${enemy.size}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#ff0000";
      ctx.shadowBlur = 16;
      ctx.fillText("☠️", enemy.x, enemy.y);
      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function updatePlayer() {
    if (keys.ArrowLeft || keys.a || keys.A) player.x -= player.speed;
    if (keys.ArrowRight || keys.d || keys.D) player.x += player.speed;
    if (keys.ArrowUp || keys.w || keys.W) player.y -= player.speed;
    if (keys.ArrowDown || keys.s || keys.S) player.y += player.speed;

    player.x = Math.max(26, Math.min(canvas.width - 26, player.x));
    player.y = Math.max(38, Math.min(canvas.height - 26, player.y));
  }

  function updateEnemies() {
    spawnTimer++;

    if (spawnTimer > 120) {
      enemies.push(createEnemy());
      spawnTimer = 0;
    }

    enemies.forEach((enemy) => {
      enemy.x += enemy.speedX;
      enemy.y += enemy.speedY;

      if (
        enemy.x < -70 ||
        enemy.x > canvas.width + 70 ||
        enemy.y < -70 ||
        enemy.y > canvas.height + 70
      ) {
        Object.assign(enemy, createEnemy());
      }
    });

    if (enemies.length > 9) {
      enemies.shift();
    }
  }

  function updateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
    });

    particles = particles.filter((p) => p.life > 0);
  }

  function distance(aX, aY, bX, bY) {
    return Math.hypot(aX - bX, aY - bY);
  }

  function makeParticles(x, y, color) {
    for (let i = 0; i < 14; i++) {
      particles.push({
        x,
        y,
        vx: -3 + Math.random() * 6,
        vy: -3 + Math.random() * 6,
        size: 2 + Math.random() * 4,
        life: 30,
        color
      });
    }
  }

  function checkCollisions() {
    collectibles.forEach((item) => {
      if (item.collected) return;

      if (distance(player.x, player.y, item.x, item.y) < 38) {
        item.collected = true;
        score++;
        makeParticles(item.x, item.y, "#00f5ff");
      }
    });

    enemies.forEach((enemy) => {
      if (distance(player.x, player.y, enemy.x, enemy.y) < 34) {
        lives--;
        makeParticles(player.x, player.y, "#ff2aa3");

        player.x = canvas.width * 0.16;
        player.y = canvas.height * 0.5;

        Object.assign(enemy, createEnemy());

        if (lives <= 0) {
          gameRunning = false;
          drawGameOver();
        }
      }
    });

    if (score >= emojisToCollect.length) {
      gameRunning = false;
      gameWon = true;
      drawWinScreen();
    }
  }

  function drawGameOver() {
    drawBackground();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "42px Arial, sans-serif";
    ctx.fillStyle = "#ff2aa3";
    ctx.shadowColor = "#ff2aa3";
    ctx.shadowBlur = 18;
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 28);

    ctx.font = "18px Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText("The FUD got you. Try again.", canvas.width / 2, canvas.height / 2 + 18);

    ctx.restore();
  }

  function drawWinScreen() {
    drawBackground();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "34px Arial, sans-serif";
    ctx.fillStyle = "#00f5ff";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 18;
    ctx.fillText("RABBIT HOLE UNLOCKED", canvas.width / 2, canvas.height / 2 - 35);

    ctx.font = "48px Arial, sans-serif";
    ctx.fillText("🧸 🚀 🌕", canvas.width / 2, canvas.height / 2 + 15);

    ctx.font = "17px Arial, sans-serif";
    ctx.fillStyle = "#ffea00";
    ctx.shadowColor = "#ffea00";
    ctx.fillText("Click ENTER SITE to continue.", canvas.width / 2, canvas.height / 2 + 68);

    ctx.restore();
  }

  function drawGame() {
    if (!canvas || !ctx) return;

    drawBackground();
    updatePlayer();
    updateEnemies();
    updateParticles();
    checkCollisions();

    drawCollectibles();
    drawEnemies();
    drawParticles();
    drawPlayer();
    drawText();

    if (gameRunning) {
      animationFrame = requestAnimationFrame(drawGame);
    }
  }

  window.startGame = startGame;
  window.enterSite = enterSite;

  if (startGameBtn) {
    startGameBtn.addEventListener("click", startGame);
  }

  if (enterSiteBtn) {
    enterSiteBtn.addEventListener("click", enterSite);
  }

  window.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    if (event.key === "Enter" && gameWon) {
      enterSite();
    }
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  if (canvas) {
    canvas.addEventListener("pointermove", (event) => {
      if (!gameRunning) return;

      const rect = canvas.getBoundingClientRect();
      player.x = event.clientX - rect.left;
      player.y = event.clientY - rect.top;
    });

    canvas.addEventListener("click", () => {
      if (!gameRunning && !gameWon) {
        startGame();
      }
    });
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();

  if (canvas && ctx) {
    drawBackground();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "28px Arial, sans-serif";
    ctx.fillStyle = "#00f5ff";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 18;
    ctx.fillText("INSERT COIN", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "16px Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText("Collect emojis. Avoid the FUD skulls.", canvas.width / 2, canvas.height / 2 + 28);
    ctx.restore();
  }

  /* ======================================================
     SIMPLE POPUP MODALS FOR OLD HUB BUTTONS
  ====================================================== */

  const modal =
    document.getElementById("modal") ||
    document.getElementById("siteModal") ||
    document.querySelector(".modal");

  const modalTitle =
    document.getElementById("modalTitle") ||
    document.getElementById("siteModalTitle") ||
    (modal ? modal.querySelector("h2") : null);

  const modalText =
    document.getElementById("modalText") ||
    document.getElementById("siteModalText") ||
    (modal ? modal.querySelector("p") : null);

  const closeModal =
    document.getElementById("closeModal") ||
    document.querySelector(".close-modal") ||
    document.querySelector(".modal-close");

  document.querySelectorAll("[data-title][data-text]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!modal || !modalTitle || !modalText) return;

      modalTitle.textContent = button.dataset.title;
      modalText.textContent = button.dataset.text;
      modal.classList.add("active");
    });
  });

  if (closeModal && modal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("active");
      }
    });
  }
});
