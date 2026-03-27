// cart.js — manages cart state, rendering, and drawer UI

let cart = JSON.parse(localStorage.getItem('cart')) || []; // [{ id, name, price, img, qty }]

const badge        = document.getElementById('badge');
const cartOverlay  = document.getElementById('cartOverlay');
const cartDrawer   = document.getElementById('cartDrawer');
const cartEmpty    = document.getElementById('cartEmpty');
const cartItemsEl  = document.getElementById('cartItems');
const cartFooter   = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');

// ── Open / Close ──────────────────────────────────────────
export function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('navCart').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ── Mutations ─────────────────────────────────────────────
export function addItem({ id, name, price, img }) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price: parseFloat(price), img, qty: 1 });
  }
  renderCart();
}

export function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

export function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

// ── Render ────────────────────────────────────────────────
export function renderCart() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  badge.textContent = totalQty;
  badge.classList.toggle('visible', totalQty > 0);

  if (cart.length === 0) {
    cartEmpty.style.display    = 'flex';
    cartItemsEl.style.display  = 'none';
    cartFooter.style.display   = 'none';
    return;
  }

  cartEmpty.style.display   = 'none';
  cartItemsEl.style.display = 'flex';
  cartFooter.style.display  = 'block';

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">J$${item.price.toFixed(2)}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeItem('${item.id}')">Remove</button>
      </div>
    </div>
  `).join('');

  cartSubtotal.textContent = `J$${subtotal.toFixed(2)}`;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Expose mutation helpers globally so inline onclick handlers in renderCart() work
window.changeQty = changeQty;
window.removeItem = removeItem;
window.goToCheckout = function () {
  window.location.href = "checkout.html";
};
