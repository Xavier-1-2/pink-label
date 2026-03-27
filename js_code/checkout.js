const cart = JSON.parse(localStorage.getItem('cart')) || [];

const container = document.getElementById('checkoutItems');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const form = document.getElementById('checkoutForm');

let subtotal = 0;

// ── Render Items ─────────────────────────────
container.innerHTML = cart.map(item => {
  subtotal += item.price * item.qty;

  return `
    <div class="checkout-item">
      <img src="${item.img}">
      <div>
        <div>${item.name}</div>
        <div>Qty: ${item.qty}</div>
        <div>J$${item.price.toFixed(2)}</div>
      </div>
    </div>
  `;
}).join('');

subtotalEl.textContent = `J$${subtotal.toFixed(2)}`;
totalEl.textContent = `J$${subtotal.toFixed(2)}`;

// ── Handle Purchase ─────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;

  const order = {
    id: Date.now(),
    name,
    address,
    items: cart,
    total: subtotal
  };

  // Save order
  localStorage.setItem('lastOrder', JSON.stringify(order));

  // Clear cart
  localStorage.removeItem('cart');

  // Go to receipt
  window.location.href = "receipt.html";
});