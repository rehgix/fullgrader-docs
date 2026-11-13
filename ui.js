/* ui.js · Comportamientos comunes 2026 de fullgrader.app.
   Se carga al final de cada página. Cada bloque comprueba si su página
   tiene lo que necesita; si no, no hace nada. */
(function () {
  var page = document.body.getAttribute('data-page') || '';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function lang() { return document.documentElement.lang || 'es'; }

  /* ================= Ajuda ================= */
  if (page === 'help') (function () {
    var TXT = {
      es: ['Ningún apartado coincide con la búsqueda.', '{n} de {t} apartados'],
      ca: ['Cap apartat coincideix amb la cerca.', '{n} de {t} apartats'],
      gl: ['Ningún apartado coincide coa busca.', '{n} de {t} apartados'],
      eu: ['Ez dago bilaketarekin bat datorren atalik.', '{n} / {t} atal'],
      en: ['No section matches your search.', '{n} of {t} sections'],
      de: ['Kein Abschnitt passt zur Suche.', '{n} von {t} Abschnitten'],
      fr: ['Aucune rubrique ne correspond à la recherche.', '{n} rubriques sur {t}'],
      it: ['Nessuna sezione corrisponde alla ricerca.', '{n} di {t} sezioni'],
      pt: ['Nenhuma secção corresponde à pesquisa.', '{n} de {t} secções']
    };
    function t(i) { return (TXT[lang()] || TXT.en)[i]; }

    /* Abrir y cerrar con animación de altura */
    function setOpen(sec, open) {
      var body = sec.querySelector('.section-body');
      if (!body || still || !body.animate) { sec.classList.toggle('open', open); return; }
      if (sec._anim) sec._anim.cancel();
      var from, to;
      if (open) { sec.classList.add('open'); to = body.scrollHeight; from = 0; }
      else { from = body.scrollHeight; to = 0; sec.classList.add('anim'); sec.classList.remove('open'); }
      var a = body.animate([{ height: from + 'px', opacity: open ? 0 : 1 }, { height: to + 'px', opacity: open ? 1 : 0 }],
        { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
      sec._anim = a;
      a.onfinish = a.oncancel = function () { sec.classList.remove('anim'); sec._anim = null; };
    }
    window.toggle = function (header) { var s = header.parentElement; setOpen(s, !s.classList.contains('open')); };
    // Accesible con teclado: las cabeceras se comportan como botones.
    document.querySelectorAll('.section-header').forEach(function (h) {
      h.setAttribute('role', 'button'); h.tabIndex = 0;
      h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.toggle(h); } });
    });

    document.querySelectorAll('[data-lang] > main').forEach(function (main) {
      var block = main.parentElement;
      var secs = Array.prototype.slice.call(main.querySelectorAll('.section'));
      var toc = main.querySelector('.toc');
      var links = toc ? Array.prototype.slice.call(toc.querySelectorAll('a')) : [];

      /* Buscador instantáneo */
      var tools = main.querySelector('.help-tools');
      if (tools) {
        var wrap = tools.querySelector('.help-search'), input = tools.querySelector('input'), clr = tools.querySelector('.clr');
        var count = tools.querySelector('.help-count');
        var empty = document.createElement('p'); empty.className = 'help-empty'; empty.hidden = true;
        secs[secs.length - 1].insertAdjacentElement('afterend', empty);
        var norm = function (x) { return x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
        secs.forEach(function (s) { s._txt = norm(s.textContent.replace(/\s+/g, ' ')); });
        var before = null;
        var run = function () {
          var q = norm(input.value.trim());
          wrap.classList.toggle('has', !!q);
          if (q && !before) before = secs.map(function (s) { return s.classList.contains('open'); });
          var words = q.split(/\s+/).filter(Boolean), n = 0;
          secs.forEach(function (s, i) {
            var ok = !q || words.every(function (w) { return s._txt.indexOf(w) >= 0; });
            s.hidden = !ok; if (ok) n++;
            if (q) s.classList.toggle('open', ok && n <= 3);
            if (links[i]) links[i].parentElement.hidden = !ok;
          });
          if (!q && before) { secs.forEach(function (s, i) { s.classList.toggle('open', before[i]); }); before = null; }
          empty.hidden = !(q && n === 0); empty.textContent = t(0);
          count.textContent = q ? t(1).replace('{n}', n).replace('{t}', secs.length) : '';
        };
        input.addEventListener('input', run);
        input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; run(); } });
        clr.addEventListener('click', function () { input.value = ''; run(); input.focus(); });
      }

      /* Índice compacto para móvil */
      if (toc && links.length) {
        var mini = document.createElement('div'); mini.className = 'toc-mini';
        var label = document.createElement('label');
        var sel = document.createElement('select');
        var title = toc.querySelector('.toc-title');
        sel.setAttribute('aria-label', title ? title.textContent : '');
        var o0 = document.createElement('option'); o0.value = ''; o0.textContent = (title ? title.textContent : '') + ' · ' + links.length; sel.appendChild(o0);
        links.forEach(function (a, i) { var o = document.createElement('option'); o.value = a.getAttribute('href'); o.textContent = (i + 1) + '. ' + a.textContent; sel.appendChild(o); });
        sel.addEventListener('change', function () { if (sel.value) { location.hash = sel.value; } });
        label.appendChild(sel); mini.appendChild(label);
        (tools || toc).insertAdjacentElement(tools ? 'beforebegin' : 'afterend', mini);
        block._mini = sel;
      }

      /* Paso activo en el índice al desplazarse: el último apartado cuya
         cabecera ya ha pasado por debajo de la barra superior */
      if (links.length) {
        var raf = 0;
        var spy = function () {
          raf = 0;
          if (!block.classList.contains('visible')) return;
          var cur = null;
          secs.forEach(function (s) { if (!s.hidden && s.getBoundingClientRect().top <= 140) cur = s; });
          if (!cur) cur = secs.filter(function (s) { return !s.hidden; })[0];
          if (!cur) return;
          links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id); });
          if (block._mini) block._mini.value = '#' + cur.id;
        };
        window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(spy); }, { passive: true });
        window.addEventListener('resize', spy);
        spy();
      }
    });
  })();

  /* ================= Preguntas frecuentes ================= */
  if (page === 'faq') (function () {
    document.querySelectorAll('.faq-filters').forEach(function (bar) {
      var list = bar.nextElementSibling;
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var cat = b.getAttribute('data-filter');
        bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        list.querySelectorAll('details').forEach(function (d) {
          d.hidden = !(cat === 'all' || d.getAttribute('data-cat') === cat);
        });
      });
    });
  })();

  /* ================= Contacto: copiar el correo ================= */
  document.querySelectorAll('.copy-mail').forEach(function (b) {
    var label = b.querySelector('span'), orig = label.textContent, timer = null;
    b.addEventListener('click', function () {
      var mail = b.getAttribute('data-mail');
      var done = function () {
        b.classList.add('done'); label.textContent = '✓ ' + b.getAttribute('data-ok');
        clearTimeout(timer); timer = setTimeout(function () { b.classList.remove('done'); label.textContent = orig; }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(mail).then(done, fallback);
      else fallback();
      function fallback() {
        var ta = document.createElement('textarea'); ta.value = mail; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });
})();
