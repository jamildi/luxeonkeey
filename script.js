/* ============================================================
   LUXE ONKEY v2 — Script
   ============================================================ */

/* ── Scroll-triggered nav ── */
const nav = document.getElementById('nav');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('solid', y > 60);
  if (backTop) backTop.classList.toggle('show', y > 500);
}, { passive: true });

/* ── Mobile burger ── */
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

if (burger && navMobile) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navMobile.classList.remove('open');
    });
  });
}

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (nav?.offsetHeight || 72) + 8;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── Intersection observer — AOS-like ── */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.aosDelay || 0);
      setTimeout(() => e.target.classList.add('aos-in'), delay);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

aosEls.forEach(el => aosObs.observe(el));

/* ── Counters ── */
const countEls = document.querySelectorAll('.count[data-to]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || 0);
    const sep = el.dataset.sep === 'true';
    const dur = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);

    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const val = ease(p) * to;
      if (dec > 0) {
        el.textContent = val.toFixed(dec);
      } else if (sep) {
        el.textContent = Math.round(val).toLocaleString('fr-FR');
      } else {
        el.textContent = Math.round(val);
      }
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });

countEls.forEach(el => counterObs.observe(el));

/* ── Active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach(s => navObs.observe(s));

/* ── FAQ ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq__item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── Audit form ── */
function handleAudit(e) {
  e.preventDefault();
  const form = document.getElementById('auditForm');
  const success = document.getElementById('auditSuccess');
  if (!form || !success) return;

  form.style.transition = 'opacity .3s, transform .3s';
  form.style.opacity = '0';
  form.style.transform = 'translateY(-8px)';

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    success.style.opacity = '0';
    requestAnimationFrame(() => {
      success.style.transition = 'opacity .4s';
      success.style.opacity = '1';
    });
  }, 320);
}

/* ── Expose globals ── */
window.toggleFaq = toggleFaq;
window.handleAudit = handleAudit;
