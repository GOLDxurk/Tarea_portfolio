/* =========================================================
   Portfolio · Adrián Acevedo Reinoso
   - Resaltado del enlace activo en la navegación
   - Animación de entrada al hacer scroll
   - Año del footer
   (El cambio de tema está en theme.js)
   ========================================================= */

(() => {
  "use strict";

  const revealItems = document.querySelectorAll(".reveal");
  const navLinks = document.querySelectorAll('.nav > a[href^="#"]');

  /* ---------- Enlace activo en el nav + animación de entrada ---------- */
  if ("IntersectionObserver" in window) {
    const sections = Array.from(navLinks)
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => spy.observe(section));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    // Navegadores antiguos: mostramos todo sin animar
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  /* ---------- Año del footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
