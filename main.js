import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";


document.addEventListener("DOMContentLoaded", function () {
  const launchDate = new Date("2025-08-15T00:00:00");

  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `
      <div class="fade-in">
        <h1 class="text-white text-[40px] font-bold">${days}</h1>
        <p class="text-white text-[18px]">Days</p>
      </div>
      <div class="fade-in">
        <h1 class="text-white text-[40px] font-bold">${hours}</h1>
        <p class="text-white text-[18px]">Hours</p>
      </div>
      <div class="fade-in">
        <h1 class="text-white text-[40px] font-bold">${minutes}</h1>
        <p class="text-white text-[18px]">Minutes</p>
      </div>
      <div class="fade-in">
        <h1 class="text-white text-[40px] font-bold">${seconds}</h1>
        <p class="text-white text-[18px]">Seconds</p>
      </div>`;

    if (distance < 0) {
      clearInterval(timerInterval);
      document.getElementById("countdown").innerHTML =
        "<div class='col-span-4 text-4xl font-bold text-white fade-in'>We have launched!</div>";
    }
  }, 1000);

  // Form Logic
  const form = document.getElementById("subscribe-form");
  const emailInput = document.getElementById("email-input");
  const successMessage = document.getElementById("success-message");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    // Show message
    successMessage.style.display = "block";
    successMessage.classList.add("fade-in-scale");

    // Clear input
    emailInput.value = "";

    // Hide message after 3s (optional)
    setTimeout(() => {
      successMessage.classList.remove("fade-in-scale");
      successMessage.style.display = "none";
    }, 3000);
  });
});

