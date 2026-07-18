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

  // --- THEME TOGGLE (LIGHT/DARK) ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Check localStorage preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
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
