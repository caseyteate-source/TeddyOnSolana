
const rabbitHotspots = [
  {
    id: "arcade",
    title: "Arcade Cabinet",
    tag: "Play Again",
    text: "Return to the $TEDDY arcade game.",
    url: "index.html",
    sameTab: true,
    x: 14,
    y: 54,
    w: 16,
    h: 38
  },
  {
    id: "kitty-files",
    title: "Kitty Files",
    tag: "Investigation Board",
    text: "Open the Roaring Kitty investigation board.",
    url: "kitty.html",
    sameTab: true,
    x: 50,
    y: 35,
    w: 28,
    h: 28
  },
  {
    id: "emoji",
    title: "Emoji Timeline",
    tag: "VHS Shelf",
    text: "Follow the emoji timeline.",
    url: "emoji.html",
    sameTab: true,
    x: 80,
    y: 72,
    w: 19,
    h: 18
  },
  {
    id: "memory",
    title: "Memory Room",
    tag: "Imagine The Future",
    text: "Enter the 1980s memory room.",
    url: "memory.html",
    sameTab: true,
    x: 77,
    y: 42,
    w: 18,
    h: 24
  },
  {
    id: "moass",
    title: "MOASS",
    tag: "Easter Egg",
    text: "A very serious educational musical experience.",
    url: "https://youtu.be/RO6JiFztJdg?si=BqHPez0QepkQeCkz",
    sameTab: false,
    x: 48,
    y: 12,
    w: 18,
    h: 10
  },
  {
    id: "lamp",
    title: "The Lamp",
    tag: "Easter Egg",
    text: "The light has a story to tell.",
    url: "https://youtu.be/jJN9mBRX3uo",
    sameTab: false,
    x: 61,
    y: 25,
    w: 10,
    h: 18
  },
  {
    id: "phone",
    title: "Rotary Phone",
    tag: "Callin' Oates",
    text: "Sometimes the rabbit hole calls you back.",
    url: "tel:7192662837",
    sameTab: true,
    x: 34,
    y: 73,
    w: 10,
    h: 12
  },
  {
    id: "gamestop",
    title: "GameStop",
    tag: "Official Link",
    text: "Open GameStop's official investor relations page.",
    url: "https://investor.gamestop.com/",
    sameTab: false,
    x: 35,
    y: 37,
    w: 12,
    h: 12
  },
  {
    id: "teddy",
    title: "The Teddy Files",
    tag: "Coming Soon",
    text: "A future page for Teddy, Ryan Cohen's books, and community theories.",
    url: "teddy.html",
    sameTab: true,
    x: 52,
    y: 70,
    w: 12,
    h: 16
  },
  {
    id: "buck",
    title: "Buck the Bunny",
    tag: "Easter Egg",
    text: "The rabbit was here first.",
    url: "buck.html",
    sameTab: true,
    x: 70,
    y: 20,
    w: 11,
    h: 14
  }
];

const container = document.getElementById("rabbitHotspots");
const modal = document.getElementById("rabbitModal");
const closeBtn = document.getElementById("rabbitClose");
const tag = document.getElementById("rabbitTag");
const title = document.getElementById("rabbitTitle");
const text = document.getElementById("rabbitText");
const link = document.getElementById("rabbitLink");

rabbitHotspots.forEach((spot) => {
  const button = document.createElement("button");
  button.className = `rabbit-hotspot ${spot.id}`;
  button.style.left = spot.x + "%";
  button.style.top = spot.y + "%";
  button.style.width = spot.w + "%";
  button.style.height = spot.h + "%";
  button.setAttribute("aria-label", spot.title);
  button.title = spot.title;

  button.addEventListener("click", () => {
    tag.textContent = spot.tag;
    title.textContent = spot.title;
    text.textContent = spot.text;
    link.href = spot.url;
    link.textContent = spot.sameTab ? "ENTER" : "OPEN LINK";
    link.target = spot.sameTab ? "_self" : "_blank";
    modal.classList.add("active");
  });

  container.appendChild(button);
});

closeBtn.addEventListener("click", () => modal
