const button = document.getElementById("enterBoard");
const cards = document.querySelectorAll(".card");

button.addEventListener("click", () => {
  document.querySelector(".board").scrollIntoView({ behavior: "smooth" });
});

cards.forEach(card => {
  card.addEventListener("click", () => {
    alert(card.innerText + "\n\nEvidence file opening soon...");
  });
});
