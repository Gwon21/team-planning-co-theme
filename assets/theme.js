/**
 * Team Planning Co. — Theme JavaScript
 * Handles: mobile menu, quantity selectors, cart interactions
 *
 * Mobile improvements:
 * - Animated hamburger / X icon toggle
 * - Body scroll lock when mobile menu is open
 * - Close menu on outside tap, Escape key, nav link click, and resize
 * - Smooth image gallery transitions
 */

(function () {
  'use strict';

  /* ---- Mobile Menu ---- */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-action="toggle-mobile-menu"]');
    const nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      nav.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      // Lock body scroll so the page doesn't scroll behind the drawer
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      // Restore body scroll
      document.body.style.overflow = '';
    }

    function isOpen() {
      return nav.classList.contains('is-open');
    }

    // Toggle on hamburger click
    toggle.addEventListener('click', function () {
      isOpen() ? closeMenu() : openMenu();
    });

    // Close when a nav link is tapped (prevents sticky-open drawer on SPA navigation)
    nav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus(); // return focus to toggle for accessibility
      }
    });

    // Close on outside tap/click (touching the page behind the drawer)
    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      // If the click is outside the header entirely, close
      const header = document.querySelector('.site-header');
      if (header && !header.contains(e.target)) {
        closeMenu();
      }
    });

    // Close if window resizes back to desktop width (avoids hidden-but-locked state)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && isOpen()) {
        closeMenu();
      }
    }, { passive: true });
  }

  /* ---- Quantity Selectors ---- */
  function initQuantitySelectors() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action="increase"], [data-action="decrease"]');
      if (!btn) return;
      const wrap = btn.closest('.product-detail__qty');
      if (!wrap) return;
      const input = wrap.querySelector('.qty-input');
      if (!input) return;

      const current = parseInt(input.value, 10) || 1;
      if (btn.dataset.action === 'increase') {
        input.value = current + 1;
      } else if (btn.dataset.action === 'decrease' && current > 1) {
        input.value = current - 1;
      }
    });
  }

  /* ---- Sticky Header Class ---- */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 80) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    }, { passive: true });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  /* ---- Image Gallery (Product Page) ---- */
  function initProductGallery() {
    const thumbs = document.querySelectorAll('.product-detail__thumb');
    const mainImg = document.getElementById('ProductMainImage');
    if (!mainImg || !thumbs.length) return;

    function setActiveThumb(activeThumb) {
      thumbs.forEach(function (t) { t.style.opacity = '0.6'; });
      activeThumb.style.opacity = '1';
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        setActiveThumb(thumb);
        const src = thumb.querySelector('img')?.src;
        if (src) {
          mainImg.style.opacity = '0';
          mainImg.style.transition = 'opacity 0.2s ease';
          setTimeout(function () {
            // Swap to the high-res version by replacing the thumbnail size
            mainImg.src = src.replace(/_150x(\.[a-z]+)$/, '_900x$1').replace(/width=150/, 'width=900');
            mainImg.style.opacity = '1';
          }, 200);
        }
      });
    });

    // Set first thumb as active on load
    if (thumbs.length) {
      thumbs[0].style.opacity = '1';
    }
  }

  /* ---- Initialize All ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initQuantitySelectors();
    initStickyHeader();
    initSmoothScroll();
    initProductGallery();
  });

})();
