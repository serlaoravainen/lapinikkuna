// Poista .no-js jos JS toimii
document.documentElement.classList.remove('no-js');

// Taustablobien kevyt parallax
const root = document.documentElement;
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.02;
  root.style.setProperty('--bg-shift', y + 'px');
});

// Korttien reveal + rivikohtainen stagger
const cardsWrap = document.querySelector('.services .cards');

if (cardsWrap) {
  const cards = Array.from(cardsWrap.querySelectorAll('.card'));
  let revealed = false;

  const setStaggerDelays = () => {
    if (revealed) return;                  // <- älä koske viiveisiin enää
    cards.forEach(card => card.style.animationDelay = '0s');

    const rows = {};
    cards.forEach(card => {
      const top = Math.round(card.getBoundingClientRect().top);
      (rows[top] ||= []).push(card);
    });

    Object.values(rows).forEach(row => {
      row.forEach((card, i) => {
        card.style.animationDelay = `${i * 0.08}s`;
      });
    });
  };

  const onResize = () => setStaggerDelays();
  window.addEventListener('resize', onResize);

  const activate = () => {
    setStaggerDelays();
    cardsWrap.classList.add('in');
    revealed = true;
    window.removeEventListener('resize', onResize); // <- siivoa pois
  };

  const checkNow = () => {
    const r = cardsWrap.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  if (checkNow()) {
    activate();
  } else {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        activate();
        io.disconnect();
      }
    }, { threshold: 0.0, rootMargin: "0px 0px -150px 0px" });
    io.observe(cardsWrap);
  }
}


// Otsikon animointi
const title = document.querySelector('.services .section-title');
if (title) {
  const checkTitle = () => {
    const rect = title.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  if (checkTitle()) {
    title.classList.add('in');
  } else {
    const ioTitle = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        title.classList.add('in');
        ioTitle.disconnect();
      }
    }, { threshold: 0.0, rootMargin: "0px 0px -150px 0px" });
    ioTitle.observe(title);
  }
}
// Before-after slider
const baWrapper = document.querySelector('.ba-wrapper');
const baAfter = document.querySelector('.ba-after');
const baHandle = document.querySelector('.ba-handle');
const baGlow = document.querySelector('.ba-glow');
const knob = baHandle?.querySelector('.ba-circle');

if (baWrapper && baAfter && baHandle && knob) {
  let isDragging = false;

  const setPos = (pct) => {
    pct = Math.max(0, Math.min(100, pct));
    baAfter.style.width = pct + '%';
    baHandle.style.left = pct + '%';
    baGlow.style.setProperty('--x', pct + '%');
    knob.setAttribute('data-pct', Math.round(pct));
    const value = Math.round(pct);
    baHandle.setAttribute('aria-valuenow', value);
    baHandle.setAttribute('aria-valuetext', value + '%');
  };

  const moveHandle = (clientX) => {
    const rect = baWrapper.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setPos(pos);
  };

  // Mouse
  baWrapper.addEventListener('mousedown', e => { isDragging = true; moveHandle(e.clientX); });
  window.addEventListener('mousemove', e => { if (isDragging) moveHandle(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch
  baWrapper.addEventListener('touchstart', e => moveHandle(e.touches[0].clientX), { passive: true });
  baWrapper.addEventListener('touchmove', e => moveHandle(e.touches[0].clientX), { passive: true });

  // Keyboard
  baHandle.addEventListener('keydown', (e) => {
    const current = parseFloat(baAfter.style.width) || 50;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(current - 2); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPos(current + 2); }
    if (e.key === 'Home') { e.preventDefault(); setPos(0); }
    if (e.key === 'End') { e.preventDefault(); setPos(100); }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPos(50); }
  });

  // Init
  setPos(50);
}
const frame = document.querySelector('.window-frame');
const scene = document.querySelector('.window-scene');
const reflection = document.querySelector('.window-reflection');

if (frame && scene && reflection) {
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  const updateTransform = () => {
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;

    const rotateX = targetY * 5; // max 5deg kallistus y-akselilla
    const rotateY = targetX * 5;

    scene.style.transform = `translateZ(-50px) scale(1.2) translate(${targetX * 20}px, ${targetY * 20}px)`;
    reflection.style.transform = `translate(${targetX * -15}px, ${targetY * -15}px)`;

    requestAnimationFrame(updateTransform);
  };

  frame.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 … 1
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  // Mobiili: käytä deviceorientation
  window.addEventListener('deviceorientation', (e) => {
    const beta = e.beta || 0;  // X-akseli
    const gamma = e.gamma || 0; // Y-akseli
    mouseX = gamma / 45;  // skaala
    mouseY = beta / 45;
  });

  updateTransform();
}
// Korttien sisääntuloanimaatio
const whyCards = document.querySelectorAll('.why-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

whyCards.forEach(card => observer.observe(card));

// Taustavalon liike hiiren mukana
const whyBg = document.querySelector('.why-bg-light');
if (whyBg) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    whyBg.style.setProperty('--x', `${x}%`);
    whyBg.style.setProperty('--y', `${y}%`);
  });
}

(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  function setHeroVars(e) {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    hero.style.setProperty('--hx', x.toFixed(3));
    hero.style.setProperty('--hy', y.toFixed(3));
  }

  window.addEventListener('mousemove', setHeroVars, { passive: true });
  window.addEventListener('touchmove', ev => {
    if (ev.touches[0]) setHeroVars(ev.touches[0]);
  }, { passive: true });
})();

(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  function setFooterVars(e) {
    const r = footer.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    footer.style.setProperty('--hx', x.toFixed(3));
    footer.style.setProperty('--hy', y.toFixed(3));
  }

  window.addEventListener('mousemove', setFooterVars, { passive: true });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  observer.observe(footer);
})();
// Header scroll shrink
window.addEventListener('scroll', () => {
  document.querySelector('header').classList.toggle('scrolled', window.scrollY > 10);
});

// Mobiilivalikko
// Header varjostus scrollissa
// ...existing code...

// Mobile menu toggle
const burger = document.querySelector('.th-burger');
const mobileMenu = document.getElementById('th-mobile-menu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = !mobileMenu.hasAttribute('hidden');
    if (isOpen) {
      mobileMenu.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('open');
    } else {
      mobileMenu.removeAttribute('hidden');
      burger.setAttribute('aria-expanded', 'true');
      burger.classList.add('open');
    }
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
      mobileMenu.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      burger.classList.remove('open');
      burger.focus();
    }
  });
}
// --- Quote Modal ---
// Modal markup appears after the script tag, so initialize once the DOM is ready.
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;

    const overlay = modal.querySelector('.th-modal__overlay');
    const closeBtns = modal.querySelectorAll('[data-close]');
    const dialog = modal.querySelector('.th-modal__dialog');
    const form = modal.querySelector('#quote-form');
    const firstInput = form?.querySelector('input, textarea, select');
    const thanks = modal.querySelector('.th-modal__thanks');
    let lastFocused = null;

  // Avaa modaali kaikille elementeille, joilla on data-open="quote-modal".
  // Delegoitu kuuntelija varmistaa toiminnan myös dynaamisesti lisätyille napeille.
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open="quote-modal"]');
    if (!opener) return;
    e.preventDefault();
    openModal(opener);
  });

    function openModal(triggerEl) {
      lastFocused = triggerEl || document.activeElement;
      if (burger && mobileMenu && !mobileMenu.hasAttribute('hidden')) {
        mobileMenu.setAttribute('hidden', '');
        burger.setAttribute('aria-expanded', 'false');
        burger.classList.remove('open');
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      if (burger) burger.setAttribute('hidden', '');
      setTimeout(() => firstInput && firstInput.focus(), 90);
      document.addEventListener('keydown', onKeyDown);
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      if (burger) burger.removeAttribute('hidden');
      document.removeEventListener('keydown', onKeyDown);
      form?.removeAttribute('hidden');
      thanks?.setAttribute('hidden', '');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    // Perus focus trap
    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  // Sulje overlay/painikkeet
  overlay?.addEventListener('click', closeModal);
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  // Kevyt client-side validointi + feikki onnistumis-UI
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

    const email = form.querySelector('#q-email');
    const name = form.querySelector('#q-name');
    const consent = form.querySelector('#q-consent');

    function setError(input, msg) {
      valid = false;
      const holder = input.closest('.th-input')?.querySelector('.th-input__error');
      if (holder) holder.textContent = msg || 'Tarkista kenttä';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
    function clearError(input) {
      input.removeAttribute('aria-invalid');
      const holder = input.closest('.th-input')?.querySelector('.th-input__error');
      if (holder) holder.textContent = '';
    }

    if (!name.value.trim()) setError(name, 'Nimi vaaditaan'); else clearError(name);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailOk) setError(email, 'Syötä validi sähköposti'); else clearError(email);
    if (!consent.checked) { valid = false; consent.focus(); }

      if (!valid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Lähetetään…';

      const formData = new FormData(form);
      formData.append('form-name', 'quote'); // Tämä varmistaa että Netlify tunnistaa lomakkeen

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      }).then(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Lähetä pyyntö';
        form.reset();
        form.setAttribute('hidden', '');
        thanks?.removeAttribute('hidden');
        setTimeout(() => {
          closeModal();
        }, 2000);
      }).catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Lähetä pyyntö';
        alert('Lähetys epäonnistui. Yritä myöhemmin uudelleen.');
      });
    });
});
