/* ARESTERdev: navigation, WhatsApp links, reveal animations, and page loader. */
const ARESTERDEV_CONFIG = {
  whatsappNumber: "6281511585275"
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Loading screen dibuat oleh JS sehingga tidak perlu mengedit semua halaman.
  const loader = document.createElement("div");
  loader.className = "site-loader";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-label", "Memuat website ARESTERdev");
  loader.innerHTML =
    '<div class="loader-inner">' +
      '<div class="loader-mark" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<p class="loader-name">ARESTER<span>dev</span></p>' +
      '<div class="loader-track"><i></i></div>' +
      '<small>Menyiapkan pengalaman digital Anda</small>' +
    '</div>';
  document.body.prepend(loader);
  document.body.classList.add("is-loading");

  let loaderHidden = false;
  const hideLoader = () => {
    if (loaderHidden) return;
    loaderHidden = true;
    loader.classList.add("is-loaded");
    document.body.classList.remove("is-loading");
    window.setTimeout(() => loader.remove(), 550);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 180);
  } else {
    window.addEventListener("load", () => {
      window.setTimeout(hideLoader, 180);
    }, { once: true });
  }
  // Failsafe agar overlay tidak menutupi halaman jika suatu aset gagal dimuat.
  window.setTimeout(hideLoader, 3500);

  // Menu responsif.
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  // Tautan konsultasi WhatsApp.
  document.querySelectorAll(".whatsapp-link").forEach(link => {
    const message = link.dataset.message || "Halo ARESTERdev, saya ingin bertanya.";
    link.href = "https://wa.me/" + ARESTERDEV_CONFIG.whatsappNumber +
      "?text=" + encodeURIComponent(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // Tambahkan reveal ke blok konten umum tanpa mengubah HTML halaman.
  document.querySelectorAll(
    ".section-heading, .service-card, .step, .portfolio-note, " +
    ".article-card, .faq-list details, .info-card, .contact-card, .product-placeholder"
  ).forEach(el => {
    if (!el.classList.contains("reveal")) el.classList.add("reveal");
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -24px 0px" });

    revealItems.forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
      observer.observe(el);
    });
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }
});
