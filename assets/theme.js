/**
 * Faithful Occasions — Theme JavaScript
 * Handles: mobile menu, quantity selectors, cart interactions
 */

(function () {
  'use strict';

  /* ---- Mobile Menu ---- */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-action="toggle-mobile-menu"]');
    const nav = document.getElementById('mobile-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.contains('is-open');
      nav.classList.toggle('is-open');
      nav.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
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

    let lastScroll = 0;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 80) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
      lastScroll = currentScroll;
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

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.style.opacity = '0.6'; });
        thumb.style.opacity = '1';
        const src = thumb.querySelector('img')?.src;
        if (src) {
          mainImg.style.opacity = '0';
          setTimeout(function () {
            mainImg.src = src.replace('_150x', '_900x');
            mainImg.style.opacity = '1';
          }, 200);
        }
      });
    });
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
