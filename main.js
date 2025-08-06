import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  // Anti-debugging
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey &&
        ["s", "u", "i", "j", "c"].includes(e.key.toLowerCase())) ||
      e.key === "F12"
    ) {
      e.preventDefault();
    }
  });

  // Audio
  const hoverSynth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 10,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0.01,
      release: 0.2,
    },
  }).toDestination();

  const successSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle8" },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
    },
  }).toDestination();

  const playHoverSound = () => {
    if (Tone.context.state !== "running") Tone.start();
    hoverSynth.triggerAttackRelease("C4", "8n", Tone.now());
  };

  const playSuccessSound = () => {
    if (Tone.context.state !== "running") Tone.start();
    successSynth.triggerAttackRelease(["C5", "E5", "G5"], "8n", Tone.now());
  };

  const triggerConfetti = () => {
    console.log("Confetti triggered, but won't animate without GSAP.");
  };

  // --- 3D Scene ---
  let scene, camera, renderer;
  const mouse = new THREE.Vector2();

  function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 500;

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("scene-container").appendChild(renderer.domElement);

    const icons = [`<svg>...</svg>` /* Your SVGs */];

    for (let i = 0; i < 28; i++) {
      const template = document.createElement("template");
      template.innerHTML = icons[i % icons.length].trim();
      const element = template.content.firstChild;
      const object = new CSS3DObject(element);
      object.position.set(
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000
      );
      object.rotation.set(Math.random(), Math.random(), Math.random());
      scene.add(object);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  function animate3D() {
    requestAnimationFrame(animate3D);
    camera.position.x += (mouse.x * 200 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 200 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  init3D();
  animate3D();

  // --- COUNTDOWN TIMER LOGIC (with localStorage) ---
  let launchDate;
  const storedDate = localStorage.getItem("launchDate");

  if (storedDate) {
    launchDate = new Date(storedDate);
  } else {
    launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 8);
    localStorage.setItem("launchDate", launchDate.toISOString());
  }

  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      document.getElementById("countdown").innerHTML =
        "<div class='col-span-4 text-4xl font-bold text-white'>We have launched!</div>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const updateValue = (element, newValue) => {
      if (element.innerText !== newValue) {
        element.innerText = newValue;
      }
    };

    updateValue(document.getElementById("days"), String(days).padStart(2, "0"));
    updateValue(
      document.getElementById("hours"),
      String(hours).padStart(2, "0")
    );
    updateValue(
      document.getElementById("minutes"),
      String(minutes).padStart(2, "0")
    );
    updateValue(
      document.getElementById("seconds"),
      String(seconds).padStart(2, "0")
    );
  }, 1000);

  // --- Sound on Hover ---
  document
    .querySelectorAll(".timer-box")
    .forEach((box) => box.addEventListener("mouseenter", playHoverSound));

  // --- Form Submit ---
  const form = document.getElementById("subscribe-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email-input");
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      playSuccessSound();
      triggerConfetti();
      emailInput.classList.remove("border-red-500");
      document.getElementById("form-container").style.display = "none";
      document.getElementById("success-message").style.display = "block";
    } else {
      emailInput.classList.add("border-red-500");
    }
  });

  // --- Heading Split Into Spans (optional animation logic removed) ---
  const heading = document.querySelector(".main-heading");
  if (heading) {
    const text = heading.textContent.trim();
    heading.textContent = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      heading.appendChild(span);
    });
  }
});
