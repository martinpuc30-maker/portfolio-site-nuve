const experience = document.querySelector("#experience");
const opening = document.querySelector("#opening");
const canvas = document.querySelector("#stars");
const wishField = document.querySelector("#wishField");
const touchRipples = document.querySelector("#touchRipples");
const replay = document.querySelector("#replay");
const context = canvas.getContext("2d", { alpha: true });

const wishes = [
  "Contigo todo llega a ser bonito", "Hoy el mundo tiene más luz", "Gracias por estar",
  "Te mando saludos", "Que tengas un bonito día", "Siempre hay una razón para sonreír",
  "Espero que hoy seas feliz", "Gracias por todos los momentos", "Que nunca te falte una sonrisa",
  "Te deseo lo mejor", "Hoy hay un poco más de luz", "Gracias por ser especial"
];

let width = 0;
let height = 0;
let stars = [];
let started = false;
let wishTimer;

function resizeStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: Math.min(110, Math.round(width * height / 7000)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.25 + .25,
    alpha: Math.random() * .7 + .15,
    twinkle: Math.random() * .018 + .004,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawStars(time = 0) {
  context.clearRect(0, 0, width, height);
  stars.forEach((star) => {
    const alpha = star.alpha + Math.sin(time * star.twinkle + star.phase) * .16;
    context.beginPath();
    context.fillStyle = `rgba(255, ${Math.round(205 + star.radius * 25)}, 102, ${Math.max(.03, alpha)})`;
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  });
  requestAnimationFrame(drawStars);
}

function addWish() {
  if (!started) return;
  const phrase = document.createElement("span");
  phrase.className = `wish ${Math.random() > .66 ? "is-blur" : ""}`;
  phrase.textContent = wishes[Math.floor(Math.random() * wishes.length)];
  const centerSafe = 50;
  const angle = Math.random() * Math.PI * 2;
  const distance = 28 + Math.random() * 20;
  phrase.style.left = `${centerSafe + Math.cos(angle) * distance}%`;
  phrase.style.top = `${centerSafe + Math.sin(angle) * distance * .7}%`;
  phrase.style.animationDelay = `${Math.random() * .7}s`;
  wishField.appendChild(phrase);
  window.setTimeout(() => phrase.remove(), 9800);
}

function createTouchEffect(event) {
  const point = event.touches ? event.touches[0] : event;
  if (!point) return;
  const ripple = document.createElement("span");
  ripple.className = "touch-ripple";
  ripple.style.left = `${point.clientX - 4}px`;
  ripple.style.top = `${point.clientY - 4}px`;
  touchRipples.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 1200);
}

function start(event) {
  if (event && event.target.closest("#replay")) return;
  if (!started) {
    started = true;
    experience.classList.add("is-started");
    for (let index = 0; index < 4; index += 1) window.setTimeout(addWish, index * 850 + 500);
    wishTimer = window.setInterval(addWish, 2400);
  }
  createTouchEffect(event);
}

function reset() {
  started = false;
  experience.classList.remove("is-started");
  window.clearInterval(wishTimer);
  wishField.replaceChildren();
}

window.addEventListener("resize", resizeStars, { passive: true });
experience.addEventListener("pointerdown", start);
opening.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") start(event);
});
replay.addEventListener("click", (event) => {
  event.stopPropagation();
  reset();
});
resizeStars();
requestAnimationFrame(drawStars);
