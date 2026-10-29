/* ============================================================
   SKYLINK PRINT CENTER — Main JavaScript
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
   13. FAQ Accordion
   14. Newsletter Form
   15. Mobile Mega Menu
   16. Product Modals & Auto-Select (NEW)
   17. Utility: Throttle
   ============================================================ */

'use strict';

/* ============ UTILITY ============ */
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
  setTimeout(() => {
    loader.classList.add('hidden');
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

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

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


/* ============ 6. SMOOTH SCROLL ============ */
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

window.addEventListener('load', startCounters);
window.addEventListener('scroll', throttle(startCounters, 200));


/* ============ 8. REVEAL ON SCROLL ============ */
const revealTargets = document.querySelectorAll(
  '.section-head, .service-card, .product-card, .why-card, .price-card, .testimonial-card, .gallery-item, .showcase-text, .showcase-gallery, .about-img, .about-text, .contact-info, .contact-form, .cta-content, .faq-item'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// Stagger effects
document.querySelectorAll('.services-grid .service-card, .product-grid .product-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 4) * 0.08}s`;
});
document.querySelectorAll('.gallery-grid .gallery-item').forEach((item, i) => {
  item.style.transitionDelay = `${(i % 3) * 0.06}s`;
});


/* ============ 9. GALLERY FILTER ============ */
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach((item) => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        item.classList.remove('hide');
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

    if (!name || !phone || !service) {
      showToast('Please fill in your name, phone and select a service.', 'error');
      return;
    }

    const phoneRegex = /^\+?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    // Success message + WhatsApp handoff
    showToast('Thank you! Your message has been received. We\'ll be in touch shortly.', 'success');

    const waNumber = '254705294470'; // Updated with real number
    const waText = encodeURIComponent(
      `Hi Skylink Print Center!%0A%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0AMessage: ${message}`
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
 */
function showToast(msg, type = 'success') {
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


/* ============ 13. FAQ ACCORDION ============ */
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  if (!question) return;
  question.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});


/* ============ 14. NEWSLETTER FORM ============ */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input')?.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email.', 'error');
      return;
    }
    showToast('Subscribed! Welcome to Skylink Print Center. 🎉', 'success');
    newsletterForm.reset();
  });
}


/* ============ 15. MOBILE MEGA MENU ============ */
const megaLink = document.querySelector('.has-mega > a');
const megaParent = document.querySelector('.has-mega');
if (megaLink && megaParent) {
  megaLink.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      megaParent.classList.toggle('open');
    }
  });
}


/* ============ 16. PRODUCT MODALS & AUTO-SELECT (NEW) ============ */
const clickableCards = document.querySelectorAll('.clickable-card');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const modalCtaBtns = document.querySelectorAll('.modal-cta-btn');
const serviceDropdown = document.getElementById('service');

// Open Modal
clickableCards.forEach((card) => {
  card.addEventListener('click', () => {
    const targetId = card.dataset.target;
    const targetModal = document.getElementById(targetId);
    
    if (targetModal) {
      targetModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  });
});

// Close Modal Functions
function closeModals() {
  modalOverlays.forEach((modal) => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = ''; // Restore scrolling
}

// Close on X button
modalCloseBtns.forEach((btn) => {
  btn.addEventListener('click', closeModals);
});

// Close on outside click (Overlay)
modalOverlays.forEach((overlay) => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModals();
    }
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.querySelector('.modal-overlay.active')) {
    closeModals();
  }
});

// Auto-select service in form when clicking "Order Now" in a modal
modalCtaBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    // 1. Close the modal
    closeModals();
    
    // 2. Find which modal we were in
    const parentModal = btn.closest('.modal-overlay');
    let serviceToSelect = '';

    // Map the modal ID to the exact option value in the contact form
    if (parentModal) {
      if (parentModal.id === 'modal-eulogy') serviceToSelect = 'Eulogy / Memorial Programs';
      else if (parentModal.id === 'modal-harambee') serviceToSelect = 'Harambee Cards';
      else if (parentModal.id === 'modal-wedding') serviceToSelect = 'Wedding Cards & Invitations';
      else if (parentModal.id === 'modal-birthday') serviceToSelect = 'Birthday / Baby Shower Cards';
      else if (parentModal.id === 'modal-graduation') serviceToSelect = 'Graduation Programs';
      else if (parentModal.id === 'modal-business') serviceToSelect = 'Business Cards';
      else if (parentModal.id === 'modal-flyers') serviceToSelect = 'Flyers & Posters';
      else if (parentModal.id === 'modal-receipts') serviceToSelect = 'Receipt / Invoice Books';
    }

    // 3. Auto-select the dropdown in the form
    if (serviceDropdown && serviceToSelect) {
      // Find the option that matches the text and select it
      for (let i = 0; i < serviceDropdown.options.length; i++) {
        if (serviceDropdown.options[i].text === serviceToSelect) {
          serviceDropdown.selectedIndex = i;
          break;
        }
      }
    }
  });
});


/* ============ 17. CONSOLE SIGNATURE ============ */
console.log(
  '%c✨ SKYLINK PRINT CENTER ✨',
  'font-size:18px; font-weight:bold; color:#16a34a; background:#f8fafc; padding:8px 16px; border-radius:8px;'
);
console.log(
  '%cWebsite by Skylink Print Center · Print. Design. Create.',
  'font-size:12px; color:#64748b;'
);
/* ============ TESTIMONIAL 3D CAROUSEL ============ */
(function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  const track = document.getElementById('testimonialTrack');
  if (!carousel || !track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoRotateTimer = null;
  const ROTATE_INTERVAL = 5000; // 5 seconds

  // Build dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlides();
        restartAutoRotate();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlides() {
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (currentIndex + 1) % totalSlides;

    slides.forEach((slide, i) => {
      slide.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');

      if (i === currentIndex) {
        slide.classList.add('is-center');
      } else if (i === prevIndex) {
        slide.classList.add('is-left');
      } else if (i === nextIndex) {
        slide.classList.add('is-right');
      } else {
        slide.classList.add('is-hidden');
      }
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlides();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlides();
  }

  function startAutoRotate() {
    stopAutoRotate();
    autoRotateTimer = setInterval(nextSlide, ROTATE_INTERVAL);
  }

  function stopAutoRotate() {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  }

  function restartAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
  }

  // Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoRotate();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoRotate();
    });
  }

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);

  // Pause when tab is hidden (saves CPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRotate();
    } else {
      startAutoRotate();
    }
  });

  // Init
  updateSlides();
  startAutoRotate();
})();
