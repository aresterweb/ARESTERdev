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


/* CATALOG_ORDER_FORM_V1 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("catalog-order-form");
  if (!form) return;
  const product = document.getElementById("order-product");
  const summary = document.getElementById("order-summary");
  const field = id => document.getElementById(id);
  const cards = [...document.querySelectorAll(".catalog-card")];
  const filters = [...document.querySelectorAll(".catalog-filter")];

  function updateSummary() {
    const lines = [
      "Produk: " + (product.value || "Belum dipilih"),
      "Nama: " + (field("order-name").value.trim() || "Belum diisi"),
      "Kebutuhan: " + (field("order-description").value.trim() || "Belum diisi"),
      "Referensi: " + (field("order-reference").value.trim() || "-"),
      "Anggaran: " + field("order-budget").value,
      "Target waktu: " + (field("order-deadline").value.trim() || "Belum ditentukan")
    ];
    const p = document.createElement("p");
    p.textContent = lines.join("\n");
    summary.replaceChildren();
    const strong = document.createElement("strong");
    strong.textContent = "Ringkasan pesanan";
    summary.append(strong, p);
  }

  document.querySelectorAll(".catalog-select").forEach(button => {
    button.addEventListener("click", () => {
      product.value = button.dataset.product;
      updateSummary();
      field("form-pesanan").scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(f => {
      f.classList.toggle("is-active", f === button);
      f.setAttribute("aria-pressed", String(f === button));
    });
    cards.forEach(card => {
      card.hidden = button.dataset.category !== "all" &&
                    card.dataset.category !== button.dataset.category;
    });
  }));

  form.addEventListener("input", updateSummary);
  form.addEventListener("change", updateSummary);
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const value = id => field(id).value.trim();
    const message = [
      "Halo ARESTERdev! Saya ingin mengajukan pesanan.",
      "",
      "PRODUK: " + value("order-product"),
      "NAMA: " + value("order-name"),
      "KEBUTUHAN: " + value("order-description"),
      "REFERENSI: " + (value("order-reference") || "-"),
      "ANGGARAN: " + value("order-budget"),
      "TARGET WAKTU: " + (value("order-deadline") || "Belum ditentukan"),
      "",
      "Mohon informasi harga dan estimasi pengerjaan. Terima kasih."
    ].join("\n");
    window.location.href = "https://wa.me/6281511585275?text=" + encodeURIComponent(message);
  });
  updateSummary();
});


/* ARESTER_PRODUCT_FORM_PATCH_V2 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("catalog-order-form");
  const product = document.getElementById("order-product");
  const summary = document.getElementById("order-summary");
  if (!form || !product || !summary) return;

  const definitions = {
    "Landing page": ["Website", [
      ["Tujuan halaman", "Tujuan promosi dan target pengunjung", true, "textarea"],
      ["Bagian halaman", "Fitur, harga, testimoni, kontak", true, "textarea"],
      ["Fitur tambahan", "Formulir, WhatsApp, analitik", false, "textarea"]]],
    "Website profil bisnis": ["Website", [
      ["Nama dan bidang bisnis", "Nama usaha dan bidangnya", true, "text"],
      ["Halaman yang diperlukan", "Tentang, layanan, portofolio, kontak", true, "textarea"],
      ["Fitur tambahan", "Peta, blog, formulir", false, "textarea"]]],
    "Website custom": ["Website", [
      ["Tujuan website", "Apa yang ingin dibuat", true, "textarea"],
      ["Fitur dan alur", "Jelaskan kebutuhan secara rinci", true, "textarea"],
      ["Referensi", "Tautan contoh", false, "url"]]],
    "Bot Telegram": ["Bot", [
      ["Fungsi bot", "Informasi, admin, game, atau otomasi", true, "textarea"],
      ["Perintah bot", "Contoh: /start, /help", false, "text"],
      ["Integrasi", "API, database, pembayaran", false, "textarea"]]],
    "Bot custom": ["Bot", [
      ["Platform", "Telegram, web, atau lainnya", true, "text"],
      ["Alur kerja", "Jelaskan cara kerja yang dibutuhkan", true, "textarea"],
      ["Integrasi", "API, database, layanan eksternal", false, "textarea"]]],
    "Undangan digital": ["Undangan Digital", [
      ["Jenis acara", "Pernikahan, ulang tahun, atau acara lain", true, "text"],
      ["Tanggal dan waktu", "Tanggal serta jam acara", true, "text"],
      ["Lokasi", "Alamat atau tautan peta", true, "text"],
      ["Fitur undangan", "RSVP, galeri, musik, hitung mundur", false, "textarea"]]],
    "Tools dan otomatisasi": ["Tools & Otomatisasi", [
      ["Proses saat ini", "Pekerjaan yang ingin diotomatisasi", true, "textarea"],
      ["Alur yang diinginkan", "Langkah awal sampai hasil akhir", true, "textarea"],
      ["Platform dan integrasi", "Web, Telegram, API, spreadsheet", false, "textarea"]]],
    "Maintenance website": ["Maintenance & Custom", [
      ["URL website", "https://...", true, "url"],
      ["Masalah", "Jelaskan masalah atau pesan error", true, "textarea"],
      ["Prioritas", "Normal, segera, atau fleksibel", false, "text"]]],
    "Permintaan custom": ["Maintenance & Custom", [
      ["Jenis proyek", "Website, bot, integrasi, lainnya", true, "text"],
      ["Detail kebutuhan", "Jelaskan hasil yang diharapkan", true, "textarea"],
      ["Catatan", "Batasan atau kebutuhan khusus", false, "textarea"]]]
  };

  let host = document.getElementById("product-specific-fields");
  if (!host) {
    host = document.createElement("div");
    host.id = "product-specific-fields";
    host.className = "product-specific-fields";
    product.insertAdjacentElement("afterend", host);
  }

  const val = id => document.getElementById(id)?.value?.trim() || "";
  const details = () => [...host.querySelectorAll("input,textarea")].map(el => {
    const label = host.querySelector('label[for="' + el.id + '"]');
    return [label ? label.textContent.replace(/ \*$/, "") : el.name, el.value.trim()];
  });

  function renderFields() {
    host.replaceChildren();
    const def = definitions[product.value];
    if (!def) return;

    const heading = document.createElement("h3");
    heading.textContent = "Detail khusus: " + product.value;
    host.append(heading);

    def[1].forEach(([name, placeholder, required, type], i) => {
      const id = "product-extra-" + i;
      const label = document.createElement("label");
      label.htmlFor = id;
      label.textContent = name + (required ? " *" : "");

      const input = document.createElement(type === "textarea" ? "textarea" : "input");
      input.id = id;
      input.name = "product_extra_" + i;
      input.placeholder = placeholder;
      input.required = required;
      input.maxLength = 2000;
      if (type === "textarea") input.rows = 3;
      else input.type = type;

      host.append(label, input);
    });
    updateSummary();
  }

  function updateSummary() {
    const def = definitions[product.value];
    const lines = [
      "Produk: " + (product.value || "-"),
      "Kategori: " + (def ? def[0] : "-"),
      "Nama: " + (val("order-name") || "-"),
      "Kebutuhan umum: " + (val("order-description") || "-"),
      ...details().map(([k,v]) => k + ": " + (v || "-")),
      "Referensi: " + (val("order-reference") || "-"),
      "Anggaran: " + (val("order-budget") || "-"),
      "Target waktu: " + (val("order-deadline") || "-")
    ];
    const strong = document.createElement("strong");
    strong.textContent = "Ringkasan pesanan";
    const paragraph = document.createElement("p");
    paragraph.textContent = lines.join("\n");
    summary.replaceChildren(strong, paragraph);
  }

  product.addEventListener("change", renderFields);
  form.addEventListener("input", updateSummary);
  form.addEventListener("change", updateSummary);

  document.querySelectorAll(".catalog-select").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.product;
      if (!definitions[name]) return;
      product.value = name;
      renderFields();
      document.getElementById("form-pesanan")?.scrollIntoView({
        behavior: "smooth", block: "start"
      });
    });
  });

  renderFields();

  // Satu handler submit tambahan untuk memastikan detail khusus ikut terkirim.
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const def = definitions[product.value];
    if (!def) {
      product.reportValidity();
      return;
    }

    const message = [
      "Halo ARESTERdev, saya ingin memesan layanan.",
      "Produk: " + product.value,
      "Kategori: " + def[0],
      "Nama: " + val("order-name"),
      "Kebutuhan: " + val("order-description"),
      ...details().map(([k,v]) => k + ": " + (v || "-")),
      "Referensi: " + (val("order-reference") || "-"),
      "Anggaran: " + (val("order-budget") || "-"),
      "Target waktu: " + (val("order-deadline") || "-"),
      "Mohon informasi harga dan estimasi pengerjaan."
    ].join("\n");

    window.open("https://wa.me/6281511585275?text=" +
      encodeURIComponent(message), "_blank", "noopener,noreferrer");
  });
});
