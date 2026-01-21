/* =========================
   LOVE LETTERS — APP.JS
   ========================= */

/* ---------- STATE ---------- */

const AppState = {
  cart: JSON.parse(localStorage.getItem("ll-cart")) || [],
  theme: localStorage.getItem("ll-theme") || "light",
  lang: localStorage.getItem("ll-lang") || "pt"
};

/* ---------- INIT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  applyLang();
  updateCartCount();

  bindThemeToggle();
  bindLangToggle();
  bindCartButtons();
  bindFilters();
  initCartPage();
  initContactForm();
});

/* ---------- THEME ---------- */

function applyTheme() {
  document.documentElement.setAttribute("data-theme", AppState.theme);
}

function toggleTheme() {
  AppState.theme = AppState.theme === "light" ? "dark" : "light";
  localStorage.setItem("ll-theme", AppState.theme);
  applyTheme();
}

function bindThemeToggle() {
  const btn = document.getElementById("toggle-theme");
  if (btn) btn.addEventListener("click", toggleTheme);
}

/* ---------- LANGUAGE ---------- */

function applyLang() {
  document.documentElement.setAttribute("data-lang", AppState.lang);

  document.querySelectorAll("[data-lang]").forEach(el => {
    el.hidden = el.dataset.lang !== AppState.lang;
  });

  const btn = document.getElementById("toggle-lang");
  if (btn) btn.textContent = AppState.lang.toUpperCase();
}

function toggleLang() {
  AppState.lang = AppState.lang === "pt" ? "en" : "pt";
  localStorage.setItem("ll-lang", AppState.lang);
  applyLang();
}

function bindLangToggle() {
  const btn = document.getElementById("toggle-lang");
  if (btn) btn.addEventListener("click", toggleLang);
}

/* ---------- CART CORE ---------- */

function saveCart() {
  localStorage.setItem("ll-cart", JSON.stringify(AppState.cart));
}

function updateCartCount() {
  const total = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = total;
  });
}

function addToCart(product) {
  if (!product.id) return;

  const existing = AppState.cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    AppState.cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartCount();
}

/* ---------- CART BUTTONS ---------- */

function bindCartButtons() {
  document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.target.closest(".product-card");
      if (!card) return;

      const priceText = card.querySelector(".price")?.textContent || "0";

      const product = {
        id: card.querySelector(".product-link")?.dataset.productId,
        title: card.querySelector("h2")?.textContent,
        price: parseFloat(priceText.replace("€", "").trim())
      };

      addToCart(product);
    });
  });
}

/* ---------- FILTERS ---------- */

function bindFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  if (!filterButtons.length) return;

  const products = document.querySelectorAll(".product-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      products.forEach(product => {
        const match =
          filter === "all" || product.dataset.category === filter;
        product.style.display = match ? "" : "none";
      });
    });
  });
}

/* ---------- CART PAGE ---------- */

function initCartPage() {
  const itemsEl = document.querySelector("[data-cart-items]");
  const emptyEl = document.querySelector(".cart-empty");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const totalEl = document.querySelector("[data-cart-total]");
  const checkoutBtn = document.querySelector(".btn-checkout");

  if (!itemsEl) return;

  itemsEl.innerHTML = "";

  if (AppState.cart.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (emptyEl) emptyEl.hidden = true;

  let subtotal = 0;

  AppState.cart.forEach(item => {
    subtotal += item.price * item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span class="cart-item-title">${item.title}</span>
      <span class="cart-item-qty">${item.qty} × ${item.price} €</span>
    `;
    itemsEl.appendChild(li);
  });

  if (subtotalEl) subtotalEl.textContent = `${subtotal} €`;
  if (totalEl) totalEl.textContent = `${subtotal} €`;
  if (checkoutBtn) checkoutBtn.disabled = false;
}

/* ---------- CONTACT FORM (SIMULATED) ---------- */

function initContactForm() {
  const form = document.querySelector('[data-form="contact"]');
  if (!form) return;

  const status = form.querySelector(".form-status");

  form.addEventListener("submit", e => {
    e.preventDefault();

    status.textContent =
      AppState.lang === "pt"
        ? "Carta enviada. Respondemos em breve."
        : "Letter sent. We’ll reply soon.";

    form.reset();
  });
}
