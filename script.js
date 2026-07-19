/**
 * VIDHYA BOOK STORE & STATIONERY
 * Premium Business Landing Page Logic & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY HEADER ---
  const header = document.getElementById('main-header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check


  // --- MOBILE NAV HAMBURGER MENU ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('mobile-active');
  }

  function closeMobileMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('active');
    navMenu.classList.remove('mobile-active');
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close menu if clicked outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });


  // --- ACTIVE LINK ON SCROLL (SPY NAVIGATION) ---
  const sections = document.querySelectorAll('section, footer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function updateActiveNavigation() {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (!currentId) return;

    // Desktop nav spy
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        // Find corresponding link and add active
        // Wait, style.css nav links have an hover effect. We can add active state styles if desired.
      }
    });

    // Mobile bar spy
    mobileNavItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavigation, { passive: true });
  updateActiveNavigation(); // Initial run


  // --- FEATURED BOOKS SLIDER ---
  const slider = document.getElementById('books-slider');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (slider && prevBtn && nextBtn) {
    const scrollAmount = 300; // Pixels to scroll on each click

    prevBtn.addEventListener('click', () => {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
  }


  // --- ANIMATED COUNTERS (STATS) ---
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animationTriggered = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1500; // 1.5 seconds animation time
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutQuad
        const easeProgress = progress * (2 - progress);
        
        let currentValue = Math.floor(easeProgress * target);
        
        // Append '+' or '%' based on target stats
        if (target === 100) {
          stat.textContent = `${currentValue}%`;
        } else if (target === 20) {
          stat.textContent = `${currentValue}+`;
        } else if (target >= 1000) {
          // Format with commas if needed
          stat.textContent = `${currentValue.toLocaleString()}+`;
        } else {
          stat.textContent = currentValue;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          // Hardcode exact values at the end of progress
          if (target === 100) stat.textContent = '100%';
          else if (target === 20) stat.textContent = '20+';
          else if (target === 10000) stat.textContent = '10,000+';
          else if (target === 50000) stat.textContent = '50,000+';
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // Intersection Observer for Stats Section
  if ('IntersectionObserver' in window && statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
          animationTriggered = true;
          animateCounters();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver is not supported
    setTimeout(animateCounters, 1000);
  }


  // --- TESTIMONIALS CAROUSEL ---
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  const slideCount = dots.length;
  let autoplayTimer;

  function selectSlide(index) {
    if (!track) return;
    currentSlide = index;
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      clearInterval(autoplayTimer);
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      selectSlide(idx);
      startAutoplay(); // restart autoplay timer
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      let nextSlide = (currentSlide + 1) % slideCount;
      selectSlide(nextSlide);
    }, 6000); // 6 seconds per slide
  }

  if (track && slideCount > 0) {
    startAutoplay();
  }


  // --- GALLERY LIGHTBOX PREVIEW ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  function openLightbox(imageSrc, altText) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imageSrc;
    lightboxImg.alt = altText;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-image');
      const imgElement = item.querySelector('.gallery-img');
      const alt = imgElement ? imgElement.alt : 'Vidhya Book Store photograph';
      openLightbox(src, alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });


  // --- FAQ ACCORDION ---
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(headerBtn => {
    headerBtn.addEventListener('click', () => {
      const faqItem = headerBtn.parentElement;
      const faqContent = faqItem.querySelector('.faq-content');
      const isCurrentlyActive = faqItem.classList.contains('active');

      // Close all other FAQs first (Accordion style)
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-content').style.maxHeight = null;
      });

      if (!isCurrentlyActive) {
        faqItem.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
        faqContent.style.maxHeight = faqContent.scrollHeight + "px";
      }
    });
  });

  // --- SCROLL PROGRESS INDICATOR ---
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgress.style.width = scrolled + '%';
    }, { passive: true });
  }

  // --- LOADER OVERLAY FADE-OUT ---
  const loader = document.getElementById('loader');
  if (loader) {
    // Fade out loader overlay after page load
    window.addEventListener('load', () => {
      loader.classList.add('fade-out');
    });
    // Fallback if onload doesn't fire immediately (e.g. cached page)
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
      }
    }, 1500);
  }



  // --- BACK TO TOP BUTTON ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- SWIPE SUPPORT FOR TESTIMONIALS ---
  let touchStartX = 0;
  let touchEndX = 0;

  if (track && slideCount > 0) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe left -> next slide
      clearInterval(autoplayTimer);
      let nextSlide = (currentSlide + 1) % slideCount;
      selectSlide(nextSlide);
      startAutoplay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe right -> prev slide
      clearInterval(autoplayTimer);
      let prevSlide = (currentSlide - 1 + slideCount) % slideCount;
      selectSlide(prevSlide);
      startAutoplay();
    }
  }

});


/* ==========================================================
   VIDHYA BOOK STORE — BESTSELLING BOOKS CATALOGUE
   Cart System, Product Modal, Checkout & Order Management
   ========================================================== */

// ─── BOOK DATABASE ───────────────────────────────────────
const BOOKS_DB = {
  1: {
    id: 1,
    title: 'Parmar SSC FATMAN',
    fullTitle: 'Parmar SSC FATMAN GK/GS Theory Book (2nd Edition)',
    author: 'Parmar Sir',
    category: 'SSC Bestseller',
    badge: '🔥 Bestseller',
    description: "India's most popular GK & GS theory book for SSC, Railway, Defence and other competitive examinations. Updated exam-specific content with conceptual clarity.",
    features: ['SSC CGL, CHSL, CPO, MTS & Railway', 'Updated 2nd Edition Content', 'English Medium', 'Concept-backed with Mnemonics', 'Available at Vidhya Book Store'],
    mrp: 549,
    price: 449,
    imageSrc: 'images/parmar_fatman_front.jpg',
    imageAlt: 'Parmar SSC FATMAN GK/GS Theory Book',
    hasImage: true,
    placeholderClass: null
  },
  2: {
    id: 2,
    title: 'Wings of Fire',
    fullTitle: 'Wings of Fire — An Autobiography',
    author: 'A.P.J. Abdul Kalam',
    category: 'Autobiography',
    badge: '⭐ Inspirational',
    description: "Dr. A.P.J. Abdul Kalam's inspiring autobiography about dreams, dedication and success. A must-read for every Indian student and dreamer.",
    features: ["India's Most Inspiring Autobiography", 'Former President of India', 'Dream, Dedication & Hard Work', 'Available at Vidhya Book Store', 'Universities Press Edition'],
    mrp: 399,
    price: 149,
    imageSrc: 'images/wings_of_fire.jpg',
    imageAlt: 'Wings of Fire by APJ Abdul Kalam',
    hasImage: true,
    placeholderClass: null
  },
  3: {
    id: 3,
    title: 'The Courage To Be Disliked',
    fullTitle: 'The Courage To Be Disliked',
    author: 'Ichiro Kishmi & Fumitake Koga',
    category: 'Self Help',
    badge: '🔥 Trending',
    description: "A bestselling self-help classic based on Alfred Adler's psychology, teaching confidence, freedom and happiness through Socratic dialogue.",
    features: ['10 Million Copy Bestseller', 'Based on Adlerian Psychology', 'Philosophy for everyday life', 'A single book can change your life', 'Available at Vidhya Book Store'],
    mrp: null,
    price: 149,
    imageSrc: 'images/courage_to_be_disliked.jpg',
    imageAlt: 'The Courage To Be Disliked',
    hasImage: true,
    placeholderClass: null
  },
  4: {
    id: 4,
    title: 'The 48 Laws of Power',
    fullTitle: 'The 48 Laws of Power',
    author: 'Robert Greene',
    category: 'Leadership',
    badge: '💥 Limited Offer',
    description: 'Master influence, leadership and strategic thinking through timeless principles. An international bestseller drawing from historical masters.',
    features: ['International Bestseller', '48 Laws of Strategic Influence', "Robert Greene's Masterwork", 'Historical wisdom & case studies', 'Available at Vidhya Book Store'],
    mrp: 699,
    price: 149,
    imageSrc: 'images/48_laws_of_power.jpg',
    imageAlt: 'The 48 Laws of Power by Robert Greene',
    hasImage: true,
    placeholderClass: null
  },
  5: {
    id: 5,
    title: 'The Power of Your Subconscious Mind',
    fullTitle: 'The Power of Your Subconscious Mind',
    author: 'Joseph Murphy',
    category: 'Mind & Psychology',
    badge: '⭐ Best Seller',
    description: "One of the world's most influential books on positive thinking and personal growth. Unlock the extraordinary power within you.",
    features: ['Millions of copies sold worldwide', 'Positive thinking & visualization', 'Unlock subconscious potential', 'Practical daily exercises', 'Available at Vidhya Book Store'],
    mrp: 399,
    price: 149,
    hasImage: true,
    imageSrc: 'images/power_of_subconscious_mind.jpg',
    imageAlt: 'The Power of Your Subconscious Mind by Dr. Joseph Murphy',
    placeholderClass: null
  },
  6: {
    id: 6,
    title: 'The Art of War',
    fullTitle: 'The Art of War',
    author: 'Sun Tzu',
    category: 'Strategy',
    badge: '⚔ Classic',
    description: "Sun Tzu's timeless masterpiece on strategy, leadership and decision making. Over 2,500 years of strategic wisdom still applicable today.",
    features: ['2500-year-old classic', 'Strategy for war & business', 'Leadership & decision making', 'Studied by military & CEOs', 'Available at Vidhya Book Store'],
    mrp: 399,
    price: 149,
    hasImage: true,
    imageSrc: 'images/art_of_war.jpg',
    imageAlt: 'The Art of War by Sun Tzu',
    placeholderClass: null
  },
  7: {
    id: 7,
    title: 'The Art of Detachment',
    fullTitle: 'The Art of Detachment',
    author: 'Inspirational Title',
    category: 'Mindfulness',
    badge: '🌿 Mindfulness',
    description: 'Learn emotional balance, inner peace and practical detachment in everyday life. A mindfulness guide for modern living.',
    features: ['Emotional balance & inner peace', 'Mindful detachment techniques', 'Reduce stress & anxiety', 'Daily mindfulness practices', 'Available at Vidhya Book Store'],
    mrp: null,
    price: 149,
    hasImage: true,
    imageSrc: 'images/art_of_detachment.jpg',
    imageAlt: 'The Art of Detachment by Shubham Kumar Singh',
    placeholderClass: null
  },
  8: {
    id: 8,
    title: "Don't Believe Everything You Think",
    fullTitle: "Don't Believe Everything You Think",
    author: 'Joseph Nguyen',
    category: 'Mental Wellness',
    badge: '🔥 Trending',
    description: 'Understand how overthinking creates suffering and develop a calmer, clearer mindset. A guide to ending mental suffering.',
    features: ['End overthinking & mental suffering', 'The root cause of suffering', 'Free your mind instantly', 'Practical mindset shifts', 'Available at Vidhya Book Store'],
    mrp: null,
    price: 149,
    hasImage: true,
    imageSrc: 'images/dont_believe_everything.jpg',
    imageAlt: "Don't Believe Everything You Think by Joseph Nguyen",
    placeholderClass: null
  },
  9: {
    id: 9,
    title: 'The Art of Reading Minds',
    fullTitle: 'The Art of Reading Minds',
    author: 'Henrik Fexeus',
    category: 'Psychology',
    badge: '🧠 Psychology',
    description: 'Learn body language, communication and practical psychology for daily life. Understand people better than they understand themselves.',
    features: ['Practical psychology & NLP', 'Body language mastery', 'Influence & communication', "Read people's minds & emotions", 'Available at Vidhya Book Store'],
    mrp: null,
    price: 149,
    hasImage: true,
    imageSrc: 'images/art_of_reading_minds.jpg',
    imageAlt: 'The Art of Reading Minds by Henrik Fexeus',
    placeholderClass: null
  },
  10: {
    id: 10,
    title: 'The Art of Not Overthinking',
    fullTitle: 'The Art of Not Overthinking',
    author: 'Shaurya Kapoor',
    category: 'Self Growth',
    badge: '❤️ Self Growth',
    description: 'A practical guide to reducing anxiety, building confidence and living peacefully. Find freedom from the prison of your own thoughts.',
    features: ['Overcome anxiety & self-doubt', 'Build lasting confidence', 'Live in the present moment', 'Practical daily exercises', 'Available at Vidhya Book Store'],
    mrp: null,
    price: 149,
    hasImage: true,
    imageSrc: 'images/art_of_not_overthinking.jpg',
    imageAlt: 'The Art of Not Overthinking by Shaurya Kapoor',
    placeholderClass: null
  }
};

// ─── CART STATE ───────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('vbs_cart') || '[]');
let currentModalBookId = null;
let currentOrderDetails = {};

// ─── CART UTILITIES ───────────────────────────────────────
function saveCart() {
  localStorage.setItem('vbs_cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const count = getCartCount();
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

function updateCartUI() {
  const listEl = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');
  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryEl = document.getElementById('cart-delivery');
  const grandEl = document.getElementById('cart-grand');

  if (!listEl) return;

  // Clear old items (keep empty message)
  const existingItems = listEl.querySelectorAll('.cart-item');
  existingItems.forEach(i => i.remove());

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  cart.forEach(item => {
    const book = BOOKS_DB[item.id];
    if (!book) return;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.bookId = item.id;

    const imgHtml = book.hasImage
      ? `<img src="${book.imageSrc}" alt="${book.imageAlt}" onerror="this.style.display='none'">`
      : `<div class="book-placeholder-cover ${book.placeholderClass}"><div class="bpc-glow"></div><div class="bpc-title">${book.title}</div></div>`;

    cartItem.innerHTML = `
      <div class="cart-item-img">${imgHtml}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${book.title}</div>
        <div class="cart-item-price">₹${(book.price * item.qty).toLocaleString('en-IN')}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove ${book.title}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>
    `;
    listEl.insertBefore(cartItem, emptyEl);
  });

  // Update totals
  const subtotal = getCartTotal();
  const delivery = subtotal >= 499 ? 0 : 40;
  const grand = subtotal + delivery;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE 🚚' : `₹${delivery}`;
  if (grandEl) grandEl.textContent = `₹${grand.toLocaleString('en-IN')}`;
}

// ─── CART ACTIONS ─────────────────────────────────────────
window.addToCart = function(bookId) {
  const book = BOOKS_DB[bookId];
  if (!book) return;

  const existingIndex = cart.findIndex(i => i.id === bookId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ id: bookId, qty: 1, price: book.price });
  }

  saveCart();
  updateCartCount();
  updateCartUI();

  // Flash button feedback
  const btn = document.getElementById(`add-cart-${bookId}`);
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> Added!';
    btn.style.background = '#059669';
    btn.style.color = '#fff';
    btn.style.borderColor = '#059669';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 1500);
  }

  // Open cart panel
  openCartPanel();
};

window.changeQty = function(bookId, delta) {
  const idx = cart.findIndex(i => i.id === bookId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  saveCart();
  updateCartCount();
  updateCartUI();
};

window.removeFromCart = function(bookId) {
  cart = cart.filter(i => i.id !== bookId);
  saveCart();
  updateCartCount();
  updateCartUI();
};

// ─── CART PANEL ───────────────────────────────────────────
function openCartPanel() {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  if (panel) panel.classList.add('open');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateCartUI();
}

function closeCartPanel() {
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── BUY NOW ──────────────────────────────────────────────
window.buyNow = function(bookId) {
  const book = BOOKS_DB[bookId];
  if (!book) return;

  // Add to cart if not already
  const existingIndex = cart.findIndex(i => i.id === bookId);
  if (existingIndex === -1) {
    cart.push({ id: bookId, qty: 1, price: book.price });
    saveCart();
    updateCartCount();
  }

  // Close any open modals and open checkout
  closeBookModal();
  closeCartPanel();
  openCheckout();
};

// ─── PRODUCT MODAL ────────────────────────────────────────
window.openBookModal = function(bookId) {
  const book = BOOKS_DB[bookId];
  if (!book) return;
  currentModalBookId = bookId;

  // Populate modal
  document.getElementById('modal-category').textContent = book.category;
  document.getElementById('modal-book-title').textContent = book.fullTitle;
  document.getElementById('modal-description').textContent = book.description;

  // Features
  const featuresEl = document.getElementById('modal-features');
  if (featuresEl) {
    featuresEl.innerHTML = book.features.map(f =>
      `<div class="modal-feature-item">${f}</div>`
    ).join('');
  }

  // Pricing
  const pricingEl = document.getElementById('modal-pricing');
  if (pricingEl) {
    if (book.mrp) {
      pricingEl.innerHTML = `
        <span class="price-mrp">MRP: ₹${book.mrp}</span>
        <span class="price-sale" style="font-size:1.4rem;">₹${book.price}</span>
        <span class="price-save">Save ₹${book.mrp - book.price}</span>
      `;
    } else {
      pricingEl.innerHTML = `
        <span class="price-special-label" style="font-size:0.75rem;">Special Price</span>
        <span class="price-sale" style="font-size:1.4rem;">₹${book.price}</span>
      `;
    }
  }

  // Image
  const imgWrap = document.getElementById('modal-img-wrap');
  if (imgWrap) {
    if (book.hasImage) {
      imgWrap.innerHTML = `<img src="${book.imageSrc}" alt="${book.imageAlt}" style="width:100%;height:100%;object-fit:contain;padding:16px;">`;
    } else {
      imgWrap.innerHTML = `
        <div class="book-placeholder-cover ${book.placeholderClass}" style="border-radius:16px;width:100%;height:100%;">
          <div class="bpc-glow"></div>
          <div class="bpc-title">${book.title}</div>
          <div class="bpc-author">${book.author}</div>
          <div class="bpc-tag">${book.badge}</div>
        </div>
      `;
    }
  }

  // Modal actions
  const buyBtn = document.getElementById('modal-buy-btn');
  const cartBtn = document.getElementById('modal-cart-btn');
  if (buyBtn) buyBtn.onclick = () => buyNow(bookId);
  if (cartBtn) cartBtn.onclick = () => { addToCart(bookId); closeBookModal(); };

  // Show modal
  const overlay = document.getElementById('book-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

function closeBookModal() {
  const overlay = document.getElementById('book-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ─── CHECKOUT ─────────────────────────────────────────────
function refreshCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-order-summary');
  if (!summaryEl) return;

  const subtotal = getCartTotal();
  const isPickup = document.getElementById('delivery-pickup')?.checked;
  const delivery = isPickup ? 0 : (subtotal >= 499 ? 0 : 40);
  const grand = subtotal + delivery;

  summaryEl.innerHTML = `
    ${cart.map(item => {
      const b = BOOKS_DB[item.id];
      return `<div class="cos-row"><strong>${b ? b.title : 'Book'} × ${item.qty}</strong><span>₹${(item.price * item.qty).toLocaleString('en-IN')}</span></div>`;
    }).join('')}
    <div class="cos-row"><span>Delivery</span><span>${delivery === 0 ? (isPickup ? 'FREE 🏪' : 'FREE 🚚') : '₹' + delivery}</span></div>
    <div class="cos-row cos-total-row"><span>Grand Total</span><span>₹${grand.toLocaleString('en-IN')}</span></div>
  `;
}

function openCheckout() {
  if (cart.length === 0) {
    openCartPanel();
    return;
  }

  // Reset to Home Delivery on each open
  const homeRadio = document.getElementById('delivery-home');
  if (homeRadio) homeRadio.checked = true;

  refreshCheckoutSummary();

  // Show checkout
  const overlay = document.getElementById('checkout-overlay');
  const stepSuccess = document.getElementById('step-success');
  const stepChoice = document.getElementById('step-delivery-choice');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  if (stepSuccess) stepSuccess.style.display = 'none';
  if (stepChoice) stepChoice.style.display = 'block';

  // Set min date for pickup
  const dateInput = document.getElementById('sp-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

function closeCheckout() {
  const overlay = document.getElementById('checkout-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ─── GENERATE BOOKING ID ──────────────────────────────────
function generateBookingId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VB${year}${rand}`;
}

// ─── SAVE ORDER ───────────────────────────────────────────
function saveOrder(orderData) {
  const orders = JSON.parse(localStorage.getItem('vbs_orders') || '[]');
  orders.push(orderData);
  localStorage.setItem('vbs_orders', JSON.stringify(orders));
}

// ─── SHOW SUCCESS ─────────────────────────────────────────
function showOrderSuccess(orderData) {
  const bookingId = generateBookingId();
  orderData.bookingId = bookingId;
  orderData.timestamp = new Date().toISOString();
  orderData.status = 'Pending';

  saveOrder(orderData);
  currentOrderDetails = orderData;

  // Hide form step, show success
  const stepChoice = document.getElementById('step-delivery-choice');
  const stepSuccess = document.getElementById('step-success');
  if (stepChoice) stepChoice.style.display = 'none';
  if (stepSuccess) stepSuccess.style.display = 'block';

  // Populate success
  const sbiEl = document.getElementById('sbi-value');
  if (sbiEl) sbiEl.textContent = bookingId;

  const detailsEl = document.getElementById('success-order-details');
  if (detailsEl) {
    const delivType = orderData.deliveryType === 'home' ? '🚛 Home Delivery' : '🏪 Store Pickup';
    const booksText = (orderData.books || []).map(b => `${b.title} × ${b.qty}`).join(', ');
    detailsEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px;">
        <div style="display:flex;justify-content:space-between;"><span>Booking ID</span><strong>${bookingId}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Customer</span><strong>${orderData.name}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Phone</span><strong>${orderData.phone}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Delivery</span><strong>${delivType}</strong></div>
        <div style="display:flex;justify-content:space-between;"><span>Books</span><strong>${booksText}</strong></div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #E2E8F0;margin-top:6px;padding-top:6px;"><span>Total</span><strong style="color:#059669;">₹${orderData.grandTotal}</strong></div>
      </div>
    `;
  }

  // Clear cart after success
  cart = [];
  saveCart();
  updateCartCount();
  updateCartUI();
}

// ─── DELIVERY RADIO TOGGLE ────────────────────────────────
function initDeliveryToggle() {
  const homeRadio = document.getElementById('delivery-home');
  const pickupRadio = document.getElementById('delivery-pickup');
  const homeForm = document.getElementById('home-form');
  const pickupForm = document.getElementById('pickup-form');
  const optHome = document.getElementById('opt-home');
  const optPickup = document.getElementById('opt-pickup');

  function updateForms() {
    if (homeRadio && homeRadio.checked) {
      if (homeForm) homeForm.style.display = 'flex';
      if (pickupForm) pickupForm.style.display = 'none';
      if (optHome) optHome.classList.add('selected');
      if (optPickup) optPickup.classList.remove('selected');
    } else {
      if (homeForm) homeForm.style.display = 'none';
      if (pickupForm) pickupForm.style.display = 'flex';
      if (optHome) optHome.classList.remove('selected');
      if (optPickup) optPickup.classList.add('selected');
    }
    // Live-update order summary whenever delivery method changes
    refreshCheckoutSummary();
  }

  if (homeRadio) homeRadio.addEventListener('change', updateForms);
  if (pickupRadio) pickupRadio.addEventListener('change', updateForms);
  updateForms();
}

// ─── FORM SUBMISSIONS ─────────────────────────────────────
function initForms() {
  const homeForm = document.getElementById('home-form');
  const pickupForm = document.getElementById('pickup-form');

  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('hd-name').value.trim();
      const phone = document.getElementById('hd-phone').value.trim();
      const house = document.getElementById('hd-house').value.trim();
      const area = document.getElementById('hd-area').value.trim();
      const landmark = document.getElementById('hd-landmark').value.trim();
      const time = document.getElementById('hd-time').value;
      const notes = document.getElementById('hd-notes').value.trim();

      if (!name || !phone || !house || !area) {
        alert('Please fill in all required fields (marked with *)');
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      const subtotal = getCartTotal();
      const delivery = subtotal >= 499 ? 0 : 40;

      const orderData = {
        deliveryType: 'home',
        name, phone,
        address: `${house}, ${area}${landmark ? ', Near ' + landmark : ''}`,
        preferredTime: time || 'Any time',
        notes,
        books: cart.map(i => ({ ...i, title: BOOKS_DB[i.id]?.title || 'Book' })),
        subtotal,
        deliveryCharge: delivery,
        grandTotal: subtotal + delivery
      };

      showOrderSuccess(orderData);
    });
  }

  if (pickupForm) {
    pickupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sp-name').value.trim();
      const phone = document.getElementById('sp-phone').value.trim();
      const date = document.getElementById('sp-date').value;
      const time = document.getElementById('sp-time').value;
      const msg = document.getElementById('sp-msg').value.trim();

      if (!name || !phone || !date || !time) {
        alert('Please fill in all required fields (marked with *)');
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      const subtotal = getCartTotal();
      const orderData = {
        deliveryType: 'pickup',
        name, phone,
        pickupDate: date,
        pickupTime: time,
        notes: msg,
        address: 'B-6, Payal Plaza, Bhanwarkua, Indore',
        books: cart.map(i => ({ ...i, title: BOOKS_DB[i.id]?.title || 'Book' })),
        subtotal,
        deliveryCharge: 0,
        grandTotal: subtotal
      };

      showOrderSuccess(orderData);
    });
  }
}

// ─── SUCCESS ACTIONS ──────────────────────────────────────
function initSuccessActions() {
  // Download PNG/JPEG options
  const pngBtn = document.getElementById('btn-download-png');
  const jpegBtn = document.getElementById('btn-download-jpeg');

  function downloadAsImage(format) {
    if (!currentOrderDetails.bookingId) return;

    const elementToCapture = document.querySelector('#step-success');
    if (!elementToCapture) return;

    // Show visual feedback or loading state on button
    const btn = format === 'png' ? pngBtn : jpegBtn;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="wa-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="animation: spin 1s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      Generating...
    `;

    // Inline style rule for spin animation if not already present
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    const options = {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure success actions are hidden in the screenshot
        const actions = clonedDoc.querySelector('.success-actions');
        if (actions) actions.style.display = 'none';
        const note = clonedDoc.querySelector('.success-note');
        if (note) note.style.display = 'none';
      }
    };

    html2canvas(elementToCapture, options).then(canvas => {
      const link = document.createElement('a');
      const filename = `VBS_Booking_${currentOrderDetails.bookingId}`;
      
      if (format === 'jpeg') {
        link.download = `${filename}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
      } else {
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
      }
      link.click();

      // Reset button
      btn.disabled = false;
      btn.innerHTML = originalText;
    }).catch(err => {
      console.error('Screenshot generation failed, falling back to text file:', err);
      
      // Reset button
      btn.disabled = false;
      btn.innerHTML = originalText;

      // Fallback text download
      const content = `
VIDHYA BOOK STORE — ORDER CONFIRMATION
=======================================
Booking ID:  ${currentOrderDetails.bookingId}
Date:        ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
Customer:    ${currentOrderDetails.name}
Phone:       ${currentOrderDetails.phone}
Delivery:    ${currentOrderDetails.deliveryType === 'home' ? 'Home Delivery' : 'Store Pickup'}
${currentOrderDetails.deliveryType === 'home' ? `Address: ${currentOrderDetails.address}` : `Pickup: ${currentOrderDetails.pickupDate} at ${currentOrderDetails.pickupTime}`}

BOOKS ORDERED:
${(currentOrderDetails.books || []).map(b => `  - ${b.title} × ${b.qty}  ₹${b.price * b.qty}`).join('\n')}

Subtotal:    ₹${currentOrderDetails.subtotal}
Delivery:    ${currentOrderDetails.deliveryCharge === 0 ? 'FREE' : '₹' + currentOrderDetails.deliveryCharge}
Grand Total: ₹${currentOrderDetails.grandTotal}
Payment:     Cash on Delivery
      `.trim();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (pngBtn) {
    pngBtn.addEventListener('click', () => downloadAsImage('png'));
  }
  if (jpegBtn) {
    jpegBtn.addEventListener('click', () => downloadAsImage('jpeg'));
  }

  // Copy Booking ID
  const copyBtn = document.getElementById('btn-copy-booking');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const bid = currentOrderDetails.bookingId || '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(bid).then(() => {
          copyBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Booking ID`;
          }, 2000);
        });
      } else {
        // Fallback
        const el = document.createElement('textarea');
        el.value = bid;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy Booking ID'; }, 2000);
      }
    });
  }

  // WhatsApp Confirmation
  const waBtn = document.getElementById('btn-whatsapp-confirm');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!currentOrderDetails.bookingId) return;
      const books = (currentOrderDetails.books || []).map(b => `• ${b.title} × ${b.qty}`).join('\n');
      const msg = encodeURIComponent(
        `*Vidhya Book Store — Order Confirmation*\n\n` +
        `Booking ID: *${currentOrderDetails.bookingId}*\n` +
        `Name: ${currentOrderDetails.name}\n` +
        `Phone: ${currentOrderDetails.phone}\n` +
        `Delivery: ${currentOrderDetails.deliveryType === 'home' ? 'Home Delivery' : 'Store Pickup'}\n\n` +
        `*Books:*\n${books}\n\n` +
        `Total: ₹${currentOrderDetails.grandTotal} (COD)\n\n` +
        `Store: Vidhya Book Store, B-6, Payal Plaza, Bhanwarkua, Indore`
      );
      window.open(`https://wa.me/918982883332?text=${msg}`, '_blank');
    });
  }
}

// ─── STICKY BUY BAR (Mobile) ──────────────────────────────
function initStickyBuyBar() {
  const bar = document.getElementById('sticky-buy-bar');
  const section = document.getElementById('bestsellers');
  if (!bar || !section) return;

  // Show only on mobile
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return;

  let barVisible = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && !barVisible) {
        bar.style.display = 'flex';
        barVisible = true;
      } else if (entry.isIntersecting) {
        bar.style.display = 'none';
        barVisible = false;
      }
    });
  }, { threshold: 0.1 });

  observer.observe(section);
}

// ─── EVENT LISTENERS ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Initialize cart count on page load
  updateCartCount();

  // Cart button in navbar
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', openCartPanel);
  }

  // Cart panel close
  const cartClose = document.getElementById('cart-panel-close');
  if (cartClose) cartClose.addEventListener('click', closeCartPanel);

  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartPanel);

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    closeCartPanel();
    openCheckout();
  });

  // Book Modal close
  const modalClose = document.getElementById('book-modal-close');
  if (modalClose) modalClose.addEventListener('click', closeBookModal);

  const bookModalOverlay = document.getElementById('book-modal-overlay');
  if (bookModalOverlay) {
    bookModalOverlay.addEventListener('click', (e) => {
      if (e.target === bookModalOverlay) closeBookModal();
    });
  }

  // Checkout close
  const checkoutClose = document.getElementById('checkout-close');
  if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);

  const checkoutOverlay = document.getElementById('checkout-overlay');
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutOverlay) closeCheckout();
    });
  }

  // Keyboard ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookModal();
      closeCartPanel();
      closeCheckout();
    }
  });

  // Initialize delivery toggle
  initDeliveryToggle();

  // Initialize forms
  initForms();

  // Initialize success actions
  initSuccessActions();

  // Sticky buy bar (mobile only)
  initStickyBuyBar();

  // Add bestsellers nav link to navbar
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    const homeLink = navMenu.querySelector('a[href="#home"]');
    if (homeLink && homeLink.parentElement) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="#bestsellers" class="nav-link">Bestsellers</a>';
      homeLink.parentElement.after(li);
    }
  }

  // Intersection Observer for catalogue section fade-in
  const bookCards = document.querySelectorAll('.book-card');
  if ('IntersectionObserver' in window && bookCards.length) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    bookCards.forEach(card => {
      card.style.animationPlayState = 'paused';
      cardObserver.observe(card);
    });
  }
});

