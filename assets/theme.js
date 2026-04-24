/**
 * Team Planning Co. — Theme JavaScript
 *
 * Mobile improvements in this version:
 * - Measures real header height and sets --header-height CSS variable
 *   so every page clears the sticky header automatically
 * - Full-screen slide-in overlay mobile menu (replaces old dropdown)
 * - Body scroll lock when mobile nav is open
 * - Close on backdrop tap, Escape key, nav link click, and resize to desktop
 * - Animated hamburger lines → X (pure CSS, driven by aria-expanded)
 * - Smooth product image gallery transitions
 */

(function () {
  'use strict';

  /* ============================================================
     HEADER HEIGHT — measure and expose as CSS custom property
     This runs immediately and on every resize so padding-top
     on <main> stays accurate for all viewport sizes.
     ============================================================ */
  function initHeaderHeight() {
    var header = document.querySelector('.site-header');
    var main = document.querySelector('main');
    if (!header) return;

    function setHeight() {
      var h = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', h + 'px');
      // Also set directly on main as a fallback for browsers that
      // don't process CSS custom properties on the fly
      if (main) main.style.paddingTop = h + 'px';
    }

    setHeight();

    // Re-measure on resize (font size, orientation, etc. can change header height)
    window.addEventListener('resize', setHeight, { passive: true });
  }

  /* ============================================================
     FULL-SCREEN MOBILE NAV OVERLAY
     ============================================================ */
  function initMobileMenu() {
    var toggle = document.querySelector('[data-action="toggle-mobile-menu"]');
    var overlay = document.getElementById('mobile-nav-overlay');
    var backdrop = document.getElementById('mobile-nav-backdrop');
    if (!toggle || !overlay) return;

    function openMenu() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      if (backdrop) backdrop.classList.add('is-visible');
      // Lock body scroll — prevent page scrolling behind the overlay
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }

    function closeMenu() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      if (backdrop) backdrop.classList.remove('is-visible');
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    function isOpen() {
      return overlay.classList.contains('is-open');
    }

    // Hamburger toggle
    toggle.addEventListener('click', function () {
      isOpen() ? closeMenu() : openMenu();
    });

    // Close when any nav link is tapped
    overlay.querySelectorAll('.mobile-nav-overlay__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on backdrop tap
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Auto-close if window grows past mobile breakpoint (avoids locked scroll on rotate)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && isOpen()) {
        closeMenu();
      }
    }, { passive: true });
  }

  /* ============================================================
     QUANTITY SELECTORS (product page)
     ============================================================ */
  function initQuantitySelectors() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="increase"], [data-action="decrease"]');
      if (!btn) return;
      var wrap = btn.closest('.product-detail__qty');
      if (!wrap) return;
      var input = wrap.querySelector('.qty-input');
      if (!input) return;

      var current = parseInt(input.value, 10) || 1;
      if (btn.dataset.action === 'increase') {
        input.value = current + 1;
      } else if (btn.dataset.action === 'decrease' && current > 1) {
        input.value = current - 1;
      }
    });
  }

  /* ============================================================
     STICKY HEADER — add scrolled class for optional styling
     ============================================================ */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 60) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    }, { passive: true });
  }

  /* ============================================================
     SMOOTH SCROLL for anchor links
     ============================================================ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerEl = document.querySelector('.site-header');
      var headerHeight = headerEl ? headerEl.offsetHeight : 80;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 24;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ============================================================
     PRODUCT IMAGE GALLERY
     ============================================================ */
  function initProductGallery() {
    var thumbs = document.querySelectorAll('.product-detail__thumb');
    var mainImg = document.getElementById('ProductMainImage');
    if (!mainImg || !thumbs.length) return;

    function setActiveThumb(activeThumb) {
      thumbs.forEach(function (t) { t.style.opacity = '0.6'; });
      activeThumb.style.opacity = '1';
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        setActiveThumb(thumb);
        var thumbImg = thumb.querySelector('img');
        if (!thumbImg) return;
        // Build the high-res src from the thumbnail src
        var src = thumbImg.src
          .replace(/_150x(\.[a-z]+)(\?|$)/, '_900x$1$2')
          .replace(/width=150/, 'width=900');
        mainImg.style.opacity = '0';
        mainImg.style.transition = 'opacity 0.2s ease';
        setTimeout(function () {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 200);
      });
    });

    // Mark first thumb as active
    if (thumbs[0]) thumbs[0].style.opacity = '1';
  }

  /* ============================================================
     INITIALIZE
     ============================================================ */
  // Header height runs ASAP (before DOMContentLoaded if possible)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderHeight);
  } else {
    initHeaderHeight();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initQuantitySelectors();
    initStickyHeader();
    initSmoothScroll();
    initProductGallery();
  });

})();
