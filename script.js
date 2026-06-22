const emojiPins = document.querySelectorAll(".emoji-pin");
const noteBox = document.getElementById("noteBox");

emojiPins.forEach((pin) => {
  pin.addEventListener("click", () => {
    const note = pin.getAttribute("data-note");
    noteBox.textContent = `${pin.textContent} ${note}`;
    noteBox.classList.remove("pop");
    void noteBox.offsetWidth;
    noteBox.classList.add("pop");
  });
});

const powerButton = document.getElementById("powerButton");
const tvScreen = document.getElementById("tvScreen");
const wonkaVideo = document.getElementById("wonkaVideo");

if (powerButton && tvScreen && wonkaVideo) {
  powerButton.addEventListener("click", () => {
    tvScreen.classList.add("tv-on");
    document.body.classList.add("tv-on-page");

    setTimeout(() => {
      wonkaVideo.play();
    }, 1600);
  });
}
