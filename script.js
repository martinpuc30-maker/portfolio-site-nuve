(() => {
  const frame = document.querySelector(".film-frame");
  const loadingScreen = document.getElementById("loadingScreen");
  const messageOne = document.getElementById("messageOne");
  const messageTwo = document.getElementById("messageTwo");
  const heroBike = document.getElementById("heroBike");
  const finalMessage = document.getElementById("finalMessage");
  const replayButton = document.getElementById("replayButton");
  const starField = document.getElementById("starField");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let timers = [];
  let runId = 0;

  // Create the star field once so it stays lightweight and has no external assets.
  for (let index = 0; index < 64; index += 1) {
    const star = document.createElement("i");
    star.className = `star${index % 17 === 0 ? " star--cross" : ""}`;
    star.style.setProperty("--x", `${Math.random() * 96 + 2}%`);
    star.style.setProperty("--y", `${Math.random() * 88 + 3}%`);
    star.style.setProperty("--size", `${Math.random() * 1.5 + 1}px`);
    star.style.setProperty("--opacity", `${Math.random() * 0.52 + 0.28}`);
    star.style.setProperty("--twinkle", `${Math.random() * 3 + 2}s`);
    star.style.setProperty("--delay", `${Math.random() * -4}s`);
    starField.append(star);
  }

  // Optional PNGs replace the built-in vector illustrations when supplied.
  document.querySelectorAll(".bike, .hero-bike").forEach((vehicle) => {
    const image = vehicle.querySelector("img");
    if (!image) return;
    if (image.complete) {
      if (image.naturalWidth > 0) vehicle.classList.add("has-image");
      else image.remove();
      return;
    }
    image.addEventListener("load", () => vehicle.classList.add("has-image"), { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
  });

  function later(callback, delay, currentRun) {
    const timer = window.setTimeout(() => {
      if (currentRun === runId) callback();
    }, delay);
    timers.push(timer);
  }

  function hideCard(card) {
    card.classList.remove("is-visible");
    card.classList.add("is-leaving");
    card.setAttribute("aria-hidden", "true");
    window.setTimeout(() => card.classList.remove("is-leaving"), 550);
  }

  function showCard(card) {
    card.classList.remove("is-leaving");
    card.classList.add("is-visible");
    card.setAttribute("aria-hidden", "false");
  }

  function resetScene() {
    runId += 1;
    timers.forEach(window.clearTimeout);
    timers = [];
    frame.classList.remove("is-awake", "is-grown", "is-blooming", "is-titled", "has-riders", "is-ending");
    [messageOne, messageTwo].forEach((card) => {
      card.classList.remove("is-visible", "is-leaving");
      card.setAttribute("aria-hidden", "true");
    });
    heroBike.classList.remove("is-visible");
    heroBike.setAttribute("aria-hidden", "true");
    finalMessage.classList.remove("is-visible");
    finalMessage.setAttribute("aria-hidden", "true");
    loadingScreen.classList.remove("is-gone");
    return runId;
  }

  function finishScene() {
    frame.classList.add("is-ending");
    finalMessage.classList.add("is-visible");
    finalMessage.setAttribute("aria-hidden", "false");
  }

  function play() {
    const currentRun = resetScene();
    const pause = reduceMotion.matches ? 150 : 1000;
    const intro = reduceMotion.matches ? 450 : 2400;

    later(() => {
      loadingScreen.classList.add("is-gone");
      frame.classList.add("is-awake");
    }, intro, currentRun);

    if (reduceMotion.matches) {
      later(() => {
        frame.classList.add("is-grown", "is-blooming", "is-titled", "has-riders");
        finishScene();
      }, intro + pause, currentRun);
      return;
    }

    later(() => frame.classList.add("is-grown"), intro + pause, currentRun);
    later(() => frame.classList.add("is-blooming"), intro + pause * 2, currentRun);
    later(() => frame.classList.add("is-titled"), intro + pause * 3, currentRun);
    later(() => frame.classList.add("has-riders"), intro + pause * 4, currentRun);
    later(() => showCard(messageOne), intro + pause * 7, currentRun);
    later(() => hideCard(messageOne), intro + pause * 11, currentRun);
    later(() => showCard(messageTwo), intro + pause * 12, currentRun);
    later(() => hideCard(messageTwo), intro + pause * 16, currentRun);
    later(() => {
      heroBike.classList.add("is-visible");
      heroBike.setAttribute("aria-hidden", "false");
    }, intro + pause * 17, currentRun);
    later(() => {
      heroBike.classList.remove("is-visible");
      heroBike.setAttribute("aria-hidden", "true");
    }, intro + pause * 21, currentRun);
    later(finishScene, intro + pause * 23, currentRun);
  }

  replayButton.addEventListener("click", play);
  play();
})();
