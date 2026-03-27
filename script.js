/* ============================================================
   LUXE ONKEY v3 — Script
   ============================================================ */

/* ── Nav solid on scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('solid', window.scrollY > 60);
  document.getElementById('backTop')?.classList.toggle('hidden', window.scrollY < 500);
}, { passive: true });

/* ── Burger ── */
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMobile?.classList.toggle('open');
});
navMobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger?.classList.remove('open');
  navMobile?.classList.remove('open');
}));

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const offset = (nav?.offsetHeight || 72) + 8;
    window.scrollTo({ top: t.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    const delay = parseInt(e.target.dataset.revealDelay || 0);
    setTimeout(() => e.target.classList.add('in'), delay);
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  revealObs.observe(el);
});

/* ── Animated counters ── */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || 0);
    const sep = el.hasAttribute('data-sep');
    animateCount(el, to, dec, sep, 1800);
    countObs.unobserve(el);
  });
}, { threshold: 0.7 });

document.querySelectorAll('.count[data-to]').forEach(el => countObs.observe(el));

function animateCount(el, to, dec, sep, dur) {
  const start = performance.now();
  const ease = t => 1 - Math.pow(1 - t, 4);
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const val = ease(p) * to;
    if (dec > 0) el.textContent = val.toFixed(dec);
    else if (sep) el.textContent = Math.round(val).toLocaleString('fr-FR');
    else el.textContent = Math.round(val);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── Nav active link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-35% 0px -60% 0px' });
sections.forEach(s => navObs.observe(s));

/* ── FAQ ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}
window.toggleFaq = toggleFaq;

/* ── Revenue calculator ── */
const revenues = {
  marrakech:  { studio: [8000,13000],   '1': [14000,20000],  '2': [22000,35000],  '3': [35000,52000],  '4': [52000,85000]  },
  casablanca: { studio: [6000,10000],   '1': [10000,15000],  '2': [16000,26000],  '3': [24000,38000],  '4': [38000,60000]  },
  agadir:     { studio: [7000,12000],   '1': [12000,18000],  '2': [18000,28000],  '3': [26000,42000],  '4': [40000,65000]  },
  rabat:      { studio: [5000,8000],    '1': [8000,13000],   '2': [14000,22000],  '3': [20000,32000],  '4': [30000,48000]  },
  tanger:     { studio: [5000,9000],    '1': [8000,14000],   '2': [13000,22000],  '3': [19000,32000],  '4': [28000,46000]  },
  fes:        { studio: [4000,7000],    '1': [7000,11000],   '2': [11000,18000],  '3': [16000,26000],  '4': [24000,40000]  },
};

function updateCalc() {
  const ville = document.getElementById('calcVille')?.value;
  const ch = document.getElementById('calcChambres')?.value;
  const box = document.getElementById('calcResult');
  if (!box) return;

  if (!ville || !ch) {
    box.innerHTML = `
      <div class="calc-placeholder">
        <i class="fas fa-calculator"></i>
        <span>Sélectionnez votre ville et le nombre de chambres</span>
      </div>`;
    return;
  }

  const r = revenues[ville]?.[ch];
  if (!r) return;

  const min = r[0], max = r[1];
  const minO = Math.round(min * 0.62), maxO = Math.round(max * 0.62);
  const fillOld = Math.round((minO / max) * 55);
  const fillNew = Math.round((max / max) * 100);

  box.innerHTML = `
    <div class="calc-output">
      <div class="calc-output-label">Estimation de vos revenus bruts / mois</div>
      <div class="calc-output-range">
        <span>${min.toLocaleString('fr-FR')}</span> — ${max.toLocaleString('fr-FR')} Dhs
      </div>
      <div class="calc-output-note">Avec Luxe Onkey · Optimisation Airbnb & Booking</div>
      <div class="calc-output-bar">
        <div class="calc-bar-wrap">
          <div class="calc-bar-label">Sans optimisation</div>
          <div class="calc-bar-track">
            <div class="calc-bar-fill calc-bar-fill-old" style="width:0" data-w="${fillOld}%"></div>
          </div>
        </div>
        <div class="calc-bar-wrap">
          <div class="calc-bar-label">Avec Luxe Onkey</div>
          <div class="calc-bar-track">
            <div class="calc-bar-fill calc-bar-fill-new" style="width:0" data-w="95%"></div>
          </div>
        </div>
      </div>
      <a href="#audit" class="calc-cta">
        Obtenir mon estimation précise <i class="fas fa-arrow-right"></i>
      </a>
    </div>`;

  // Animate bars
  requestAnimationFrame(() => {
    box.querySelectorAll('.calc-bar-fill').forEach(b => {
      requestAnimationFrame(() => { b.style.width = b.dataset.w; });
    });
  });
}
window.updateCalc = updateCalc;

/* ── 9-step audit form (index.html) ── */
const auditAnswers = {
  typeLogement:'', chambres:'', disponibilites:'',
  standing:'', objectif:'', ville:'', quartier:'', prenom:''
};
const AUDIT_TOTAL = 9;

function auditUpdateBar(stepNum) {
  const bar = document.getElementById('auditBar');
  if (bar) bar.style.width = (stepNum / AUDIT_TOTAL * 100) + '%';
}

function auditChoice(fromId, toId, field, btn) {
  const group = btn.closest('.audit-choices');
  group.querySelectorAll('.audit-choice').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  auditAnswers[field] = btn.innerText.replace(/^[A-Z]\s+/, '').trim();
  setTimeout(() => auditGoStep(fromId, toId), 280);
}
window.auditChoice = auditChoice;

function auditTextField(fieldId, fieldName, fromId, toId, required) {
  const val = document.getElementById(fieldId)?.value.trim();
  if (required && !val) { document.getElementById(fieldId)?.focus(); return; }
  auditAnswers[fieldName] = val || '';
  auditGoStep(fromId, toId);
}
window.auditTextField = auditTextField;

function auditGoStep(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  if (!from || !to) return;
  from.classList.add('hidden');
  to.classList.remove('hidden');
  to.style.opacity = '0';
  to.style.transform = 'translateX(16px)';
  requestAnimationFrame(() => {
    to.style.transition = 'opacity .35s, transform .35s';
    to.style.opacity = '1';
    to.style.transform = 'none';
  });
  const stepNum = parseInt(toId.replace('afstep', ''));
  auditUpdateBar(stepNum);
  document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function handleAuditSubmit() {
  const prenom = document.getElementById('af-prenom')?.value.trim();
  const phone  = document.getElementById('af-phone')?.value.trim();
  if (!phone) { document.getElementById('af-phone')?.focus(); return; }
  auditAnswers.prenom = prenom || '';

  const btn = document.querySelector('#afstep9 .btn-gold-full');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi…'; }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'aaa08af5-f7c4-4c85-ba04-3166e04ff7e7',
        subject: '🏠 Nouvelle demande — Luxe Onkey (Site principal)',
        from_name: auditAnswers.prenom || 'Prospect',
        Prénom: auditAnswers.prenom || '-',
        Téléphone: phone,
        'Type de logement': auditAnswers.typeLogement || '-',
        Chambres: auditAnswers.chambres || '-',
        Disponibilités: auditAnswers.disponibilites || '-',
        Standing: auditAnswers.standing || '-',
        Objectif: auditAnswers.objectif || '-',
        Ville: auditAnswers.ville || '-',
        Quartier: auditAnswers.quartier || '-'
      })
    });
    const data = await res.json();
    if (data.success) auditShowSuccess();
    else throw new Error(data.message);
  } catch(err) {
    console.error(err);
    auditShowSuccess();
  }
}
window.handleAuditSubmit = handleAuditSubmit;

function auditShowSuccess() {
  document.querySelectorAll('#auditForm .form-step').forEach(s => s.classList.add('hidden'));
  const ok = document.getElementById('formSuccess');
  if (ok) { ok.classList.remove('hidden'); ok.classList.add('visible'); }
  auditUpdateBar(9);
}

/* ── Shake utility ── */
function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake .4s ease';
}

/* ── Inject shake keyframes ── */
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(style);

/* ── Fix faq-a inner ── */
document.querySelectorAll('.faq-a').forEach(a => {
  const txt = a.textContent.trim();
  if (txt) {
    a.innerHTML = `<div class="faq-a-inner">${txt}</div>`;
  }
});
