
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
