/* Barra fija común: palabra «Idioma» traducida, desplegable invisible encima
   y que todo quepa en una línea. Cada página llama a FGBar.sync(idioma). */
(function () {
  var LANGWORD = { es: 'Idioma', ca: 'Idioma', gl: 'Idioma', eu: 'Hizkuntza', en: 'Language', de: 'Sprache', fr: 'Langue', it: 'Lingua', pt: 'Idioma' };
  function fit() {
    var row = document.querySelector('.topbar-row');
    if (!row) return;
    row.classList.remove('c1');
    if (row.scrollWidth > row.clientWidth + 1) row.classList.add('c1');
  }
  window.FGBar = {
    sync: function (lang) {
      var sel = document.getElementById('langSelect');
      if (sel) { sel.value = lang; sel.setAttribute('aria-label', LANGWORD[lang] || 'Language'); }
      var lw = document.querySelector('[data-langword]');
      if (lw) lw.textContent = LANGWORD[lang] || 'Language';
      fit();
    },
    onChange: function (fn) {
      var sel = document.getElementById('langSelect');
      if (sel) sel.addEventListener('change', function () { fn(sel.value); });
    }
  };
  window.addEventListener('resize', fit);
})();
