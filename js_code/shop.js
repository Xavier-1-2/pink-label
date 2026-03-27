// shop.js — handles filtering, sorting, item count, and scroll-fade for shop.html
// cart interactions are handled by product.js (quick-add + openCart) and cart.js

import { addItem, openCart } from './cart.js';

const grid       = document.getElementById('shopGrid');
const emptyState = document.getElementById('shopEmpty');
const countEl    = document.getElementById('shopCount');
const sortSelect = document.getElementById('sortSelect');

// ── Filter ────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilterSort();
  });
});

// ── Sort ─────────────────────────────────────────────────
sortSelect.addEventListener('change', applyFilterSort);

function applyFilterSort() {
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const sortVal      = sortSelect.value;

  // Get all cards from DOM (original order preserved by data-order attribute)
  const cards = [...grid.querySelectorAll('.product-card')];

  // Filter: show/hide
  const visible = cards.filter(card => {
    if (activeFilter === 'all') return true;
    const cats = card.dataset.category || '';
    return cats.split(' ').includes(activeFilter);
  });

  const hidden = cards.filter(c => !visible.includes(c));
  hidden.forEach(c => c.classList.add('hidden'));
  visible.forEach(c => c.classList.remove('hidden'));

  // Sort visible cards
  const sorted = [...visible].sort((a, b) => {
    if (sortVal === 'price-asc')  return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortVal === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
    if (sortVal === 'newest')     return Number(a.dataset.order) - Number(b.dataset.order);
    // featured: original DOM order
    return Number(a.dataset.order) - Number(b.dataset.order);
  });

  // Re-append in sorted order (hidden ones stay hidden)
  sorted.forEach(c => grid.appendChild(c));

  // Update count
  const count = visible.length;
  countEl.textContent = `${count} item${count !== 1 ? 's' : ''}`;

  // Toggle empty state
  emptyState.style.display = count === 0 ? 'block' : 'none';
}

// ── Quick-Add Buttons ─────────────────────────────────────
document.querySelectorAll('.quick-add').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const { id, name, price, img } = btn.dataset;
    addItem({ id, name, price, img });

    const orig = btn.textContent;
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('added');
    }, 1200);

    openCart();
  });
});

// ── Scroll-Fade Reveal ────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade').forEach(el => observer.observe(el));
