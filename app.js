// ===== STRIPE CHECKOUT LINK =====
const STRIPE_LINK = "https://buy.stripe.com/test_dRm9ASdp2eVjgeH8GpbMQ00";


// ===== CART STORAGE =====
function getCart() {
  return JSON.parse(localStorage.getItem("tpv_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("tpv_cart", JSON.stringify(cart));
  updateCartCount();
}


// ===== ADD TO CART =====
function addToCart(name, price) {
  let cart = getCart();

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart(cart);
  renderCart();
}


// ===== REMOVE ITEM =====
function removeFromCart(name) {
  let cart = getCart().filter(item => item.name !== name);
  saveCart(cart);
  renderCart();
}


// ===== UPDATE QUANTITY =====
function updateQuantity(name, qty) {
  let cart = getCart();

  const item = cart.find(i => i.name === name);
  if (!item) return;

  item.qty = parseInt(qty);

  if (item.qty <= 0) {
    cart = cart.filter(i => i.name !== name);
  }

  saveCart(cart);
  renderCart();
}


// ===== CALCULATE TOTAL =====
function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}


// ===== TOGGLE CART DROPDOWN =====
function toggleCart() {
  const cartEl = document.getElementById("cart-dropdown");
  if (!cartEl) return;

  cartEl.classList.toggle("open");
}


// ===== UPDATE CART COUNT ICON =====
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  countEl.textContent = totalQty;
}


// ===== RENDER CART UI =====
function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container || !totalEl) return;

  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p class='empty'>Cart is empty</p>";
    totalEl.textContent = "$0.00";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-info">
        <strong>${item.name}</strong>
        <span>$${item.price.toFixed(2)}</span>
      </div>

      <div class="cart-controls">
        <input type="number" min="1" value="${item.qty}"
          onchange="updateQuantity('${item.name}', this.value)" />

        <button onclick="removeFromCart('${item.name}')">✕</button>
      </div>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = "$" + calculateTotal(cart).toFixed(2);
}


// ===== CHECKOUT =====
function checkout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Redirect to Stripe Payment Link
  window.location.href = STRIPE_LINK;
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});
