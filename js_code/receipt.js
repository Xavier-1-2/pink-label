const order = JSON.parse(localStorage.getItem('lastOrder'));

const itemsEl = document.getElementById('receiptItems');
const totalEl = document.getElementById('total');

document.getElementById('customer').textContent = `Name: ${order.name}`;
document.getElementById('address').textContent = `Address: ${order.address}`;

itemsEl.innerHTML = order.items.map(item => `
  <div class="receipt-item">
    <span>${item.name} x${item.qty}</span>
    <span>J$${(item.price * item.qty).toFixed(2)}</span>
  </div>
`).join('');

totalEl.textContent = `Total: J$${order.total.toFixed(2)}`;

function goHome() {
  window.location.href = "shop.html";
}