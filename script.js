// Poista .no-js jos JS toimii
document.documentElement.classList.remove('no-js');

// Taustablobien kevyt parallax
const root = document.documentElement;
window.addEventListener('scroll', () => {
  const y = window.scrollY * 0.02;
  root.style.setProperty('--bg-shift', y + 'px');
});

// Korttien reveal + rivikohtainen stagger
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
    baHandle.setAttribute('aria-valuenow', Math.round(pct));
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
    if (e.key === 'ArrowLeft')  setPos(current - 2);
    if (e.key === 'ArrowRight') setPos(current + 2);
    if (e.key === 'Enter' || e.key === ' ') setPos(50);
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
}
