/* Language toggle (KO / EN) + mobile nav. Shared across all pages. */
(function () {
  var KEY = 'fndg-locale';

  function apply(loc) {
    if (loc !== 'ko' && loc !== 'en') loc = 'ko';
    var h = document.documentElement;
    h.setAttribute('data-locale', loc);
    h.setAttribute('lang', loc);
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.loc === loc));
    });
    try { localStorage.setItem(KEY, loc); } catch (e) {}
    // late layout (reveal/count) may need a recheck after text width changes
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
  }

  // initial state (head inline script already set data-locale to avoid flash;
  // mirror it here so the buttons reflect the right choice)
  var current = document.documentElement.getAttribute('data-locale') || 'ko';
  apply(current);

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var langBtn = t.closest('.lang-switch button');
    if (langBtn) { apply(langBtn.dataset.loc); return; }

    var nav = document.querySelector('.nav');
    var burger = t.closest('.nav-burger');
    if (burger && nav) {
      var open = nav.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      return;
    }
    // close mobile menu after tapping a link
    if (nav && nav.classList.contains('nav-open') && t.closest('.nav-links a')) {
      nav.classList.remove('nav-open');
      var b = nav.querySelector('.nav-burger');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  });
})();
