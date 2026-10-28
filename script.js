/* ============================================================
   SKYLINK CYBER — Main JavaScript
   Sections:
   1.  Loader
   2.  Scroll Progress Bar
   3.  Sticky Navbar
   4.  Mobile Menu (Hamburger)
   5.  Active Nav Link on Scroll
   6.  Smooth Scroll (fallback)
   7.  Hero Counter Animation
   8.  Reveal on Scroll
   9.  Gallery Filter
   10. Contact Form (validation + success)
   11. Back to Top Button
   12. Dynamic Year in Footer
   13. Utility: Throttle
   ============================================================ */

'use strict';

/* ============ UTILITY ============ */
// Simple throttle helper to limit how often a function fires
function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


/* ============ 1. LOADER ============ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Small delay so the animation is visible even on fast loads
  setTimeout(() => {
    loader.classList.add('hidden');
    // Remove from DOM after the fade-out completes
    setTimeout(() => loader.remove(), 700);
  }, 800);
});


/* ============ 2. SCROLL PROGRESS BAR ============ */
const progressBar = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = percent + '%';
}
window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();


/* ============ 3. STICKY NAVBAR ============ */
const navbar = document.getElementById('navbar');
function updateNavbar() {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNavbar);
updateNavbar();


/* ============ 4. MOBILE MENU (HAMBURGER) ============ */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link inside is clicked
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    const clickedInsideMenu = navMenu.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);
    if (!clickedInsideMenu && !clickedHamburger && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}


/* ============ 5. ACTIVE NAV LINK ON SCROLL ============ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', throttle(highlightNavLink, 150));
highlightNavLink();


/* ============ 6. SMOOTH SCROLL (fallback for older browsers) ============ */
// CSS `scroll-behavior: smooth` handles modern browsers.
// This ensures anchor links also offset correctly for the fixed navbar.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar ? navbar.offsetHeight : 80;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight + 10;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  });
});


/* ============ 7. HERO COUNTER ANIMATION ============ */
const counters = document.querySelectorAll('[data-count]');
let countersStarted = false;

function animateCounter(el) {
  const target = +el.dataset.count;
  const duration = 2000;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // easeOutQuart for a nice slowdown
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString() + '+';

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString() + '+';
    }
  }
  requestAnimationFrame(step);
}

function startCounters() {
  if (countersStarted || counters.length === 0) return;
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  const triggerPoint = heroSection.offsetTop + heroSection.offsetHeight * 0.3;
  if (window.scrollY >= triggerPoint - window.innerHeight * 0.8) {
    countersStarted = true;
    counters.forEach(animateCounter);
  }
}

// Trigger on load (in case hero is already visible) and on scroll
window.addEventListener('load', startCounters);
window.addEventListener('scroll', throttle(startCounters, 200));


/* ============ 8. REVEAL ON SCROLL ============ */
// Add `.reveal` to all main content blocks automatically so you don't need to edit HTML.
const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .why-card, .price-card, .testimonial-card, .gallery-item, .showcase-text, .showcase-gallery, .about-img, .about-text, .contact-info, .contact-form, .cta-content'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // only reveal once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// Stagger service cards & gallery items for a smoother cascade
document.querySelectorAll('.services-grid .service-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.gallery-grid .gallery-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.06}s`;
});


/* ============ 9. GALLERY FILTER ============ */
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Toggle active button
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach((item) => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.classList.remove('hide');
        // restart reveal animation
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.classList.add('hide');
      }
    });
  });
});


/* ============ 10. CONTACT FORM ============ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const service = document.getElementById('service')?.value;
    const message = document.getElementById('message')?.value.trim();

    // Basic validation
    if (!name || !phone || !service) {
      showToast('Please fill in your name, phone and select a service.', 'error');
      return;
    }

    // Phone validation (allow +, digits, spaces, dashes)
    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    // ---- Here you would normally send the data to your backend / email service ----
    // Example with fetch:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, phone, service, message })
    // });

    // For now, show a success message + optional WhatsApp handoff
    showToast('Thank you! Your message has been received. We\'ll be in touch shortly.', 'success');

    // Optional: offer to send via WhatsApp too
    const waNumber = '254XXXXXXXXX'; // <-- replace with real number
    const waText = encodeURIComponent(
      `Hi Skylink Cyber!%0A%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0AMessage: ${message}`
    );
    setTimeout(() => {
      if (confirm('Would you like to also send this message on WhatsApp for a faster reply?')) {
        window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
      }
    }, 900);

    contactForm.reset();
  });
}

/**
 * Display a lightweight toast notification.
 * @param {string} msg
 * @param {'success'|'error'} type
 */
function showToast(msg, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = msg;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    padding: '16px 26px',
    background: type === 'success' ? '#16a34a' : '#dc2626',
    color: '#fff',
    fontSize: '0.92rem',
    fontWeight: '500',
    borderRadius: '12px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    zIndex: '10000',
    opacity: '0',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    maxWidth: '90vw',
    textAlign: 'center',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}


/* ============ 11. BACK TO TOP BUTTON ============ */
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  if (!backToTop) return;
  if (window.scrollY > 500) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}
window.addEventListener('scroll', throttle(toggleBackToTop, 200));
toggleBackToTop();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============ 12. DYNAMIC YEAR IN FOOTER ============ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============ 13. KEYBOARD ACCESSIBILITY ============ */
// Close mobile menu with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
  }
});


/* ============ OPTIONAL: CONSOLE SIGNATURE ============ */
console.log(
  '%c✨ SKYLINK CYBER ✨',
  'font-size:18px; font-weight:bold; color:#2563eb; background:#f8fafc; padding:8px 16px; border-radius:8px;'
);
console.log(
  '%cWebsite by Skylink Cyber · Print. Design. Create.',
  'font-size:12px; color:#64748b;'
);
