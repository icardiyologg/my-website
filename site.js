/* erdemsakin.com — shared behaviour: header, mobile menu, scroll reveal, anchors */
(function () {
  'use strict';
 
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
 
  ready(function () {
    // current year
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
 
    // hairline under the header once scrolled
    var header = document.querySelector('header');
    if (header) {
      var onScroll = function () { header.classList.toggle('stuck', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
 
    // mobile menu
    var menuBtn = document.getElementById('menu-btn');
    var mobileNav = document.getElementById('mobile-nav');
    if (menuBtn && mobileNav) {
      var setMenu = function (open) {
        mobileNav.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      menuBtn.addEventListener('click', function () {
        setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
      });
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
      });
    }
 
    // scroll reveal
    window.revealAll = function (scope) {
      var targets = (scope || document).querySelectorAll('.reveal:not(.in)');
      if (reduced || !('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('in'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          setTimeout(function () { el.classList.add('in'); }, Math.min(i, 4) * 55);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      targets.forEach(function (el) { io.observe(el); });
    };
    window.revealAll(document);
 
    // in-page anchors, offset for the sticky header
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      });
    });
  });
})();