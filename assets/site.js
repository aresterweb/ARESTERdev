/* ARESTERdev website configuration.
   Add the official WhatsApp Business number below using international digits only,
   without +, spaces, or punctuation (example format: 6281234567890).
*/
const ARESTERDEV_CONFIG = {
  whatsappNumber: "6281511585275"
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }));
  }

  document.querySelectorAll(".whatsapp-link").forEach(link => {
    const message = link.dataset.message || "Halo ARESTERdev, saya ingin bertanya.";
    link.href = "https://wa.me/" + ARESTERDEV_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12}) : null;
  document.querySelectorAll(".reveal").forEach(el => {
    if (observer) observer.observe(el);
    else el.classList.add("is-visible");
  });
});
