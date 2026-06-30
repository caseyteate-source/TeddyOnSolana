/* ======================================================
   $TEDDY ARCADE GAME + OLD HUB MODALS
   Full recovery gameplay version
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
  let gameOver = false;
  let score = 0;
  let lives = 3;
  let frame = 0;
  let keys = {};
  let pointerActive = false;

  const player = {
    x: 120,
    y: 260,
    targetX: 120,
    targetY: 260,
    size: 42,
    speed: 4.8,
    invincible: 0
  };

  const emojiTimeline = [
    "🐶", "🇺🇸", "🎤", "👀", "🔥",
    "💥", "🍻", "💜", "🕹️", "🍿",
    "🚀", "🌕", "💎", "🧸", "🐱",
    "🎯", "🧩", "🕰️", "📼", "☎️",
    "💡", "🍫", "🎩", "🦋", "🧠",
    "🗝️", "📚", "🧃", "🧨", "🛒",
    "🏴‍☠️", "🔮", "🛸", "♾️", "🌈"
  ];

  let collectibles = [];
  let enemies = [];
  let particles = [];
  let nextEmojiIndex = 0;
  let spawnTimer = 0;

  function showElement(el) {
    if (!el) return;
    el.classList.remove("hidden");
    el.style.display = "";
  }

  function hideElement(el) {
    if (!el) return;
    el.classList.add("hidden");
  }

  function resizeCanvas() {
    if (!canvas) return;

    const parentWidth = canvas.parentElement
      ? canvas.parentElement.clientWidth
      : 900;

    canvas.width = Math.min(900, Math.max(320, parentWidth));
    canvas.height = Math.round(canvas.width * 0.56);

    player.x = clamp(player.x, 40, canvas.width - 40);
    player.y = clamp(player.y, 60, canvas.height - 40);
    player.targetX = player.x;
    player.targetY = player.y;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function distance(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function safeRandomPosition() {
    let x;
    let y;
    let attempts = 0;

    do {
      x = randomBetween(70, canvas.width - 70);
      y = randomBetween(85, canvas.height - 60);
      attempts++;
    } while (
      distance(x, y, player.x, player.y) < 150 &&
      attempts < 40
    );

    return { x, y };
  }

  function resetGame() {
    if (!canvas) return;

    resizeCanvas();

    gameRunning = true;
    gameWon = false;
    gameOver = false;
    score = 0;
    lives = 3;
    frame = 0;
    nextEmojiIndex = 0;
    spawnTimer = 0;
    pointerActive = false;

    collectibles = [];
    enemies = [];
    particles = [];

    player.x = canvas.width * 0.15;
    player.y = canvas.height * 0.5;
    player.targetX = player.x;
    player.targetY = player.y;
    player.invincible = 0;

    for (let i = 0; i < 7; i++) {
      spawnCollectible();
    }

    for (let i = 0; i < 4; i++) {
      enemies.push(createEnemy(i));
    }
  }

  function spawnCollectible() {
    if (nextEmojiIndex >= emojiTimeline.length) return;

    const pos = safeRandomPosition();

    collectibles.push({
      emoji: emojiTimeline[nextEmojiIndex],
      index: nextEmojiIndex,
      x: pos.x,
      y: pos.y,
      size: 34,
      pulse: Math.random() * Math.PI * 2,
      collected: false
    });

    nextEmojiIndex++;
  }

  function createEnemy(seed = 0) {
    const side = Math.floor(Math.random() * 4);

    let x;
    let y;
    let vx;
    let vy;

    if (side === 0) {
      x = -40;
      y = randomBetween(80, canvas.height - 60);
      vx = randomBetween(1.2, 2.2);
      vy = randomBetween(-1.2, 1.2);
    } else if (side === 1) {
      x = canvas.width + 40;
      y = randomBetween(80, canvas.height - 60);
      vx = randomBetween(-2.2, -1.2);
      vy = randomBetween(-1.2, 1.2);
    } else if (side === 2) {
      x = randomBetween(80, canvas.width - 80);
      y = -40;
      vx = randomBetween(-1.1, 1.1);
      vy = randomBetween(1.2, 2.1);
    } else {
      x = randomBetween(80, canvas.width - 80);
      y = canvas.height + 40;
      vx = randomBetween(-1.1, 1.1);
      vy = randomBetween(-2.1, -1.2);
    }

    return {
      x,
      y,
      vx,
      vy,
      size: 34,
      wobble: seed + Math.random() * Math.PI * 2
    };
  }

  function startGame() {
    if (!canvas || !ctx) {
      enterSite();
      return;
    }

    showElement(startScreen);
    hideElement(siteContent);

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    resetGame();
    drawGame();
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

  function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#070011");
    gradient.addColorStop(0.45, "#150026");
    gradient.addColorStop(1, "#00131f");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.save();

    ctx.strokeStyle = "rgba(0, 245, 255, 0.16)";
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

    ctx.strokeStyle = "rgba(255, 42, 163, 0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.fillStyle = "rgba(255, 42, 163, 0.08)";
    ctx.fillRect(0, h - 62, w, 62);

    ctx.restore();
  }

  function drawHUD() {
    ctx.save();

    ctx.font = "bold 15px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillStyle = "#00f5ff";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 12;
    ctx.fillText(`EMOJIS: ${score}/${emojiTimeline.length}`, 18, 18);

    ctx.fillStyle = "#ff2aa3";
    ctx.shadowColor = "#ff2aa3";
    ctx.fillText(`LIVES: ${"♥".repeat(lives)}`, 18, 42);

    ctx.textAlign = "right";
    ctx.fillStyle = "#ffea00";
    ctx.shadowColor = "#ffea00";
    ctx.fillText("AVOID THE FUD ☠️", canvas.width - 18, 18);

    ctx.font = "12px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.82)";
    ctx.shadowBlur = 0;
    ctx.fillText("ARROWS / WASD / DRAG", canvas.width - 18, 42);

    ctx.restore();
  }

  function drawPlayer() {
    ctx.save();

    const blink = player.invincible > 0 && Math.floor(frame / 5) % 2 === 0;

    if (!blink) {
      ctx.font = `${player.size}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#ff2aa3";
      ctx.shadowBlur = 18;
      ctx.fillText("🧸", player.x, player.y);
    }

    ctx.restore();
  }

  function drawCollectibles() {
    collectibles.forEach((item) => {
      if (item.collected) return;

      item.pulse += 0.08;

      const size = item.size + Math.sin(item.pulse) * 4;

      ctx.save();
      ctx.font = `${size}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur = 16;
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
      ctx.shadowColor = "#ff1111";
      ctx.shadowBlur = 18;
      ctx.fillText("☠️", enemy.x, enemy.y);
      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function updatePlayer() {
    let dx = 0;
    let dy = 0;

    if (keys.ArrowLeft || keys.a || keys.A) dx -= 1;
    if (keys.ArrowRight || keys.d || keys.D) dx += 1;
    if (keys.ArrowUp || keys.w || keys.W) dy -= 1;
    if (keys.ArrowDown || keys.s || keys.S) dy += 1;

    if (dx !== 0 || dy !== 0) {
      pointerActive = false;

      const length = Math.hypot(dx, dy) || 1;
      player.x += (dx / length) * player.speed;
      player.y += (dy / length) * player.speed;
      player.targetX = player.x;
      player.targetY = player.y;
    }

    if (pointerActive) {
      player.x += (player.targetX - player.x) * 0.16;
      player.y += (player.targetY - player.y) * 0.16;
    }

    player.x = clamp(player.x, 34, canvas.width - 34);
    player.y = clamp(player.y, 70, canvas.height - 34);

    if (player.invincible > 0) {
      player.invincible--;
    }
  }

  function updateEnemies() {
    spawnTimer++;

    enemies.forEach((enemy) => {
      enemy.wobble += 0.035;

      enemy.x += enemy.vx;
      enemy.y += enemy.vy + Math.sin(enemy.wobble) * 0.35;

      if (
        enemy.x < -80 ||
        enemy.x > canvas.width + 80 ||
        enemy.y < -80 ||
        enemy.y > canvas.height + 80
      ) {
        Object.assign(enemy, createEnemy());
      }
    });

    if (spawnTimer > 360 && enemies.length < 7) {
      enemies.push(createEnemy());
      spawnTimer = 0;
    }
  }

  function updateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });

    particles = particles.filter((p) => p.life > 0);
  }

  function makeParticles(x, y, color, amount = 16) {
    for (let i = 0; i < amount; i++) {
      particles.push({
        x,
        y,
        vx: randomBetween(-3.2, 3.2),
        vy: randomBetween(-3.2, 3.2),
        size: randomBetween(2, 5),
        life: 28,
        maxLife: 28,
        color
      });
    }
  }

  function checkCollectibles() {
    collectibles.forEach((item) => {
      if (item.collected) return;

      if (distance(player.x, player.y, item.x, item.y) < 38) {
        item.collected = true;
        score++;

        makeParticles(item.x, item.y, "#00f5ff", 18);

        collectibles = collectibles.filter((c) => !c.collected);

        if (nextEmojiIndex < emojiTimeline.length) {
          spawnCollectible();
        }
      }
    });

    if (score >= emojiTimeline.length && !gameWon) {
      gameWon = true;
      gameRunning = false;
      drawWinScreen();
    }
  }

  function checkEnemies() {
    if (player.invincible > 0) return;

    enemies.forEach((enemy) => {
      if (distance(player.x, player.y, enemy.x, enemy.y) < 34) {
        lives--;
        player.invincible = 90;

        makeParticles(player.x, player.y, "#ff2aa3", 24);

        player.x = canvas.width * 0.15;
        player.y = canvas.height * 0.5;
        player.targetX = player.x;
        player.targetY = player.y;
        pointerActive = false;

        Object.assign(enemy, createEnemy());

        if (lives <= 0) {
          gameOver = true;
          gameRunning = false;
          drawGameOver();
        }
      }
    });
  }

  function drawGameOver() {
    drawBackground();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 44px Arial, sans-serif";
    ctx.fillStyle = "#ff2aa3";
    ctx.shadowColor = "#ff2aa3";
    ctx.shadowBlur = 20;
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 36);

    ctx.font = "18px Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText("The FUD got you.", canvas.width / 2, canvas.height / 2 + 8);

    ctx.fillStyle = "#ffea00";
    ctx.fillText("Click START GAME to try again.", canvas.width / 2, canvas.height / 2 + 42);

    ctx.restore();
  }

  function drawWinScreen() {
    drawBackground();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 36px Arial, sans-serif";
    ctx.fillStyle = "#00f5ff";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 20;
    ctx.fillText("RABBIT HOLE UNLOCKED", canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = "48px Arial, sans-serif";
    ctx.fillText("🧸 🚀 🌕", canvas.width / 2, canvas.height / 2 + 2);

    ctx.font = "18px Arial, sans-serif";
    ctx.fillStyle = "#ffea00";
    ctx.shadowColor = "#ffea00";
    ctx.shadowBlur = 12;
    ctx.fillText("Click ENTER SITE to continue.", canvas.width / 2, canvas.height / 2 + 62);

    ctx.restore();
  }

  function drawStartScreen() {
    if (!canvas || !ctx) return;

    drawBackground();

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 34px Arial, sans-serif";
    ctx.fillStyle = "#00f5ff";
    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 18;
    ctx.fillText("INSERT COIN", canvas.width / 2, canvas.height / 2 - 48);

    ctx.font = "44px Arial, sans-serif";
    ctx.fillText("🧸", canvas.width / 2, canvas.height / 2);

    ctx.font = "16px Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.fillText("Collect the emojis. Avoid the FUD skulls.", canvas.width / 2, canvas.height / 2 + 48);

    ctx.fillStyle = "#ffea00";
    ctx.fillText("Press START GAME", canvas.width / 2, canvas.height / 2 + 78);

    ctx.restore();
  }

  function drawGame() {
    if (!canvas || !ctx) return;

    frame++;

    drawBackground();

    updatePlayer();
    updateEnemies();
    updateParticles();

    checkCollectibles();
    checkEnemies();

    drawCollectibles();
    drawEnemies();
    drawParticles();
    drawPlayer();
    drawHUD();

    if (gameRunning) {
      animationFrame = requestAnimationFrame(drawGame);
    }
  }

  function updatePointerFromEvent(event) {
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    player.targetX = clamp(event.clientX - rect.left, 34, canvas.width - 34);
    player.targetY = clamp(event.clientY - rect.top, 70, canvas.height - 34);
    pointerActive = true;
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

    if (
      gameRunning &&
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)
    ) {
      event.preventDefault();
    }

    if (event.key === "Enter" && gameWon) {
      enterSite();
    }

    if (event.key === "Enter" && gameOver) {
      startGame();
    }
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  if (canvas) {
    canvas.addEventListener("pointerdown", (event) => {
      if (!gameRunning) {
        if (gameOver) startGame();
        return;
      }

      updatePointerFromEvent(event);
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!gameRunning) return;
      if (!pointerActive && event.pointerType === "mouse") return;

      updatePointerFromEvent(event);
    });

    canvas.addEventListener("pointerup", (event) => {
      pointerActive = false;

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {}
    });

    canvas.addEventListener("pointercancel", () => {
      pointerActive = false;
    });

    canvas.addEventListener("click", () => {
      if (gameWon) {
        enterSite();
      } else if (gameOver) {
        startGame();
      }
    });
  }

  window.addEventListener("resize", () => {
    resizeCanvas();

    if (!gameRunning && !gameWon && !gameOver) {
      drawStartScreen();
    }
  });

  resizeCanvas();
  drawStartScreen();

  /* ======================================================
     SIMPLE POPUP MODALS FOR OLD HUB BUTTONS
  ====================================================== */

  const oldModal =
    document.getElementById("modal") ||
    document.getElementById("siteModal") ||
    document.querySelector(".modal");

  const oldModalTitle =
    document.getElementById("modalTitle") ||
    document.getElementById("siteModalTitle") ||
    (oldModal ? oldModal.querySelector("h2") : null);

  const oldModalText =
    document.getElementById("modalText") ||
    document.getElementById("siteModalText") ||
    (oldModal ? oldModal.querySelector("p") : null);

  const oldCloseModal =
    document.getElementById("closeModal") ||
    document.querySelector(".close-modal") ||
    document.querySelector(".modal-close");

  document.querySelectorAll("[data-title][data-text]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!oldModal || !oldModalTitle || !oldModalText) return;

      oldModalTitle.textContent = button.dataset.title;
      oldModalText.textContent = button.dataset.text;
      oldModal.classList.add("active");
    });
  });

  if (oldCloseModal && oldModal) {
    oldCloseModal.addEventListener("click", () => {
      oldModal.classList.remove("active");
    });
  }

  if (oldModal) {
    oldModal.addEventListener("click", (event) => {
      if (event.target === oldModal) {
        oldModal.classList.remove("active");
      }
    });
  }
});
