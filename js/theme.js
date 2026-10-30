/* =========================================================
   Tema Claro / Oscuro / Sistema
   - Se carga en el <head> (sin defer) para aplicar el tema antes
     del primer pintado y evitar el parpadeo.
   - La preferencia se guarda en localStorage.
   - Cuando el DOM está listo, conecta el menú del selector.
   ========================================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  // Marca que hay JS activo (las animaciones de entrada dependen de esto)
  root.classList.add("js");

  const getPreference = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "system";
    } catch {
      return "system";
    }
  };

  const savePreference = (pref) => {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // localStorage no disponible: el tema solo dura mientras la pestaña esté abierta
    }
  };

  const applyTheme = (pref) => {
    const isDark = pref === "dark" || (pref === "system" && media.matches);
    root.dataset.theme = isDark ? "dark" : "light";

    document.querySelectorAll("[data-theme-option]").forEach((btn) => {
      btn.setAttribute("aria-checked", String(btn.dataset.themeOption === pref));
    });
  };

  // Aplicación inmediata (antes de que exista el body)
  applyTheme(getPreference());

  // Si la preferencia es "Sistema", seguimos los cambios del sistema operativo
  media.addEventListener("change", () => {
    if (getPreference() === "system") applyTheme("system");
  });

  // El menú aún no existe en el <head>, así que se conecta al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    const menu = document.getElementById("theme-menu");
    if (!toggle || !menu) return;

    const setMenuOpen = (open) => {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    };

    // Marca la opción activa en el menú
    applyTheme(getPreference());

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setMenuOpen(menu.hidden);
    });

    menu.querySelectorAll("[data-theme-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pref = btn.dataset.themeOption;
        savePreference(pref);
        applyTheme(pref);
        setMenuOpen(false);
      });
    });

    document.addEventListener("click", (event) => {
      if (!menu.hidden && !menu.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !menu.hidden) {
        setMenuOpen(false);
        toggle.focus();
      }
    });
  });
})();
