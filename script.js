/* =============================================================================
   TEMPLATE SIMPLE — Formulaire de commande WhatsApp pour TikTokeurs
   KilioraLabs — version sans fiche produit / sans photo

   ─────────────────────────────────────────────────────────────────────────
   👉 POUR CRÉER UNE BOUTIQUE POUR UN NOUVEAU CLIENT :
   Modifie UNIQUEMENT l'objet STORE ci-dessous. Le reste du fichier n'a
   normalement pas besoin d'être touché.

   ─────────────────────────────────────────────────────────────────────────
   ⚠️ PARCOURS DE COMMANDE — ordre unique et obligatoire :
   1. Taille → 2. Dépôt de validation (3 000 FCFA) → 3. Capture du dépôt →
   4. Coordonnées de livraison → 5. Livraison prévue demain
   ─────────────────────────────────────────────────────────────────────────
   ========================================================================= */

const STORE = {
  name: "Bourgeois Ci",
  tagline: "Livraison rapide • Dépôt de validation • Livraison le lendemain",

  // Numéro WhatsApp du vendeur — format international SANS "+" ni espaces
  whatsapp: "2250502560403",

  currency: "FCFA",
  primaryColor: "#16a34a",

  // Logo affiché dans l'en-tête (facultatif). Laisser vide "" pour n'afficher
  // que le nom de la boutique. Exemple : "logo.png" (fichier placé à la racine
  // du repo, à côté d'index.html) ou une URL complète "https://...".
  logoUrl: "logo.jpg",

  // Montant fixe du dépôt de validation (étape 2 du parcours de commande).
  depositAmount: 3000,

  // Moyens de paiement proposés pour le dépôt de validation.
  paymentMethods: ["Orange Money", "MTN Money", "Wave"]
};

// Icônes affichées pour chaque moyen de paiement (facultatif, purement visuel)
const PAYMENT_METHOD_ICONS = {
  "Wave": "📲",
  "Orange Money": "🟠",
  "MTN Money": "💛"
};

// Numéro de réception affiché automatiquement selon le moyen de paiement sélectionné.
const PAYMENT_NUMBERS = {
  "Orange Money": "07 67 33 67 80",
  "MTN Money": "05 02 56 04 03",
  "Wave": "05 02 56 04 03"
};

/* =============================================================================
   APPLICATION DE LA CONFIGURATION AU DOM
   ========================================================================= */

(function applyStoreConfig() {
  document.documentElement.style.setProperty("--accent", STORE.primaryColor);
  document.documentElement.style.setProperty("--accent-dark", shadeColor(STORE.primaryColor, -18));

  document.title = `${STORE.name} — Commande WhatsApp`;

  setText("brandName", STORE.name);
  setText("brandTrust", STORE.tagline);
  setText("footerText", `© ${STORE.name} — Ce site ne stocke aucune donnée. Vos informations sont envoyées uniquement par WhatsApp.`);

  const depositFormatted = formatPrice(STORE.depositAmount);
  setText("totalValue", depositFormatted);
  setText("mobileTotal", depositFormatted);

  const logo = document.getElementById("brandLogo");
  if (logo && STORE.logoUrl) {
    logo.src = STORE.logoUrl;
    logo.alt = `Logo ${STORE.name}`;
    logo.hidden = false;
    logo.addEventListener("error", () => { logo.hidden = true; });
  }
})();

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function formatPrice(amount) {
  return `${Number(amount || 0).toLocaleString("fr-FR")} ${STORE.currency}`;
}

/* =============================================================================
   ÉTAT
   ========================================================================= */

const state = {
  paymentMethod: ""    // Orange Money / MTN Money / Wave
};

/* =============================================================================
   ÉTAPE 2 — Dépôt de validation : moyen de paiement + numéro dynamique
   ========================================================================= */

function renderPaymentMethodSection() {
  const optionsWrap = document.getElementById("paymentMethodOptions");

  optionsWrap.innerHTML = STORE.paymentMethods
    .map(
      method => `
      <button type="button" class="payment-card payment-card--compact" data-value="${method}" aria-pressed="${state.paymentMethod === method}">
        <span class="payment-card__icon">${PAYMENT_METHOD_ICONS[method] || "💳"}</span>
        <span class="payment-card__text">
          <span class="payment-card__title">${method}</span>
        </span>
        <span class="payment-card__check" aria-hidden="true"></span>
      </button>`
    )
    .join("");

  const methodCards = optionsWrap.querySelectorAll(".payment-card");
  methodCards.forEach(card => {
    if (card.dataset.value === state.paymentMethod) card.classList.add("is-checked");
    card.addEventListener("click", () => {
      state.paymentMethod = card.dataset.value;
      methodCards.forEach(c => {
        c.classList.remove("is-checked");
        c.setAttribute("aria-pressed", "false");
      });
      card.classList.add("is-checked");
      card.setAttribute("aria-pressed", "true");
      clearFieldError("field-paymentMethod");
      updatePaymentNumberNote();
    });
  });

  updatePaymentNumberNote();
}

/* =============================================================================
   NUMÉRO DE PAIEMENT — affiché dynamiquement sous le moyen de paiement choisi
   ========================================================================= */

function updatePaymentNumberNote() {
  const wrap = document.getElementById("field-depositNote");
  const note = document.getElementById("depositNote");
  const number = PAYMENT_NUMBERS[state.paymentMethod];

  if (number) {
    note.textContent = number;
    wrap.hidden = false;
  } else {
    note.textContent = "";
    wrap.hidden = true;
  }
}

/* =============================================================================
   VALIDATION
   ========================================================================= */

function showFieldError(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) el.classList.add("has-error");
}
function clearFieldError(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) el.classList.remove("has-error");
}

function validateForm() {
  let isValid = true;

  const size = document.getElementById("size").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const address = document.getElementById("address").value.trim();

  ["field-size", "field-phone", "field-city", "field-address", "field-depositPhone", "field-paymentMethod"]
    .forEach(clearFieldError);

  if (size.length < 1) { showFieldError("field-size"); isValid = false; }

  const phoneDigits = phone.replace(/[^0-9]/g, "");
  if (phoneDigits.length < 8) { showFieldError("field-phone"); isValid = false; }

  if (city.length < 2) { showFieldError("field-city"); isValid = false; }

  if (address.length < 3) { showFieldError("field-address"); isValid = false; }

  const depositPhone = document.getElementById("depositPhone").value.trim();
  const depositPhoneDigits = depositPhone.replace(/[^0-9]/g, "");
  if (depositPhoneDigits.length < 8) { showFieldError("field-depositPhone"); isValid = false; }

  if (!state.paymentMethod) { showFieldError("field-paymentMethod"); isValid = false; }

  return isValid;
}

/* =============================================================================
   MESSAGE WHATSAPP
   ========================================================================= */

function buildWhatsAppMessage() {
  const size = document.getElementById("size").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const address = document.getElementById("address").value.trim();
  const comment = document.getElementById("comment").value.trim();

  const lines = [
    "🛒 NOUVELLE COMMANDE",
    "",
    "📏 Taille",
    `Taille : ${size}`,
    "",
    "💳 Dépôt de validation",
    `Montant : ${formatPrice(STORE.depositAmount)}`,
    `Numéro utilisé pour le dépôt : ${document.getElementById("depositPhone").value.trim()}`,
    `Moyen de paiement : ${state.paymentMethod}`,
    `Numéro de réception : ${PAYMENT_NUMBERS[state.paymentMethod] || "—"}`,
    "",
    "📦 Coordonnées de livraison",
    `Téléphone : ${phone}`,
    `Commune : ${city}`,
    `Adresse : ${address}`,
    "",
    "🚚 Livraison prévue demain",
    "",
    `📝 Commentaire : ${comment || "—"}`
  ];

  return lines.join("\n");
}

function openWhatsApp() {
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

/* =============================================================================
   SOUMISSION
   ========================================================================= */

function handleSubmit(triggerBtn) {
  if (!validateForm()) {
    showToast("Merci de compléter les champs obligatoires.");
    const firstError = document.querySelector(".field.has-error");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  triggerBtn.classList.add("is-loading");
  const label = document.getElementById("submitBtnLabel");
  const originalLabel = label ? label.textContent : null;
  if (label) label.textContent = "Ouverture de WhatsApp…";

  setTimeout(() => {
    openWhatsApp();
    triggerBtn.classList.remove("is-loading");
    if (label && originalLabel) label.textContent = originalLabel;
  }, 350);
}

/* =============================================================================
   TOAST
   ========================================================================= */

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

/* =============================================================================
   INITIALISATION
   ========================================================================= */

function init() {
  renderPaymentMethodSection();

  ["size", "phone", "city", "address", "depositPhone"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      clearFieldError(`field-${id}`);
    });
  });

  document.getElementById("submitBtn").addEventListener("click", function () {
    handleSubmit(this);
  });
  document.getElementById("submitBtnMobile").addEventListener("click", function () {
    handleSubmit(this);
  });

  document.getElementById("orderForm").addEventListener("submit", e => e.preventDefault());
}

document.addEventListener("DOMContentLoaded", init);
