const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;

function draw() {
  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "42px Arial";
  ctx.fillText("🧸", x, 310);

  requestAnimationFrame(draw);
}

draw();
