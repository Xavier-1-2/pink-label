// product.js — handles quick-add buttons and scroll-fade animations

import { addItem, openCart } from './cart.js';

// ── Quick-Add Buttons ─────────────────────────────────────
document.querySelectorAll('.quick-add').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();

    const { id, name, price, img } = btn.dataset;
    addItem({ id, name, price, img });

    // Flash feedback
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
}, { threshold: 0.12 });

document.querySelectorAll('.fade').forEach(el => observer.observe(el));
