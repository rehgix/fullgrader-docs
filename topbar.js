/* Barra fija común: palabra «Idioma» traducida, desplegable ajustado al texto
   y que todo quepa en una línea. Cada página llama a FGBar.sync(idioma). */
(function () {
  var LANGWORD = { es: 'Idioma', ca: 'Idioma', gl: 'Idioma', eu: 'Hizkuntza', en: 'Language', de: 'Sprache', fr: 'Langue', it: 'Lingua', pt: 'Idioma' };
  function sizeSelect(sel) {
    var cs = getComputedStyle(sel);
    var m = document.createElement('span');
    m.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-family:' + cs.fontFamily + ';font-size:' + cs.fontSize + ';font-weight:' + cs.fontWeight;
    m.textContent = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
    document.body.appendChild(m);
    sel.style.width = Math.ceil(m.getBoundingClientRect().width + 20) + 'px';
    m.remove();
  }
  function fit() {
    var row = document.querySelector('.topbar-row');
    if (!row) return;
    row.classList.remove('c1', 'c2');
    var sel = document.getElementById('langSelect');
    if (sel) sizeSelect(sel);
    if (row.scrollWidth > row.clientWidth + 1) row.classList.add('c1');
    if (row.scrollWidth > row.clientWidth + 1) row.classList.add('c2');
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
