/* Barra fija común a toda la web: enlaces a las páginas (o «Menú ⌄» si no caben) e idioma («Idioma ⌄»).
   Cada página llama a FGBar.sync(idioma) cuando cambia de idioma. */
(function () {
  var LANGWORD = { es: 'Idioma', ca: 'Idioma', gl: 'Idioma', eu: 'Hizkuntza', en: 'Language', de: 'Sprache', fr: 'Langue', it: 'Lingua', pt: 'Idioma' };
  var MENUWORD = { es: 'Menú', ca: 'Menú', gl: 'Menú', eu: 'Menua', en: 'Menu', de: 'Menü', fr: 'Menu', it: 'Menu', pt: 'Menu' };
  var WAIT = { es: 'Cómo funciona', ca: 'Com funciona', gl: 'Como funciona', eu: 'Nola dabilen', en: 'How it works', de: 'So geht’s', fr: 'Comment ça marche', it: 'Come funziona', pt: 'Como funciona' };
  var BAR = ['help', 'premium', 'faq', 'contact'];
  var PAGES = ['home', 'help', 'premium', 'faq', 'contact', 'privacy', 'terms'];
  var PATH = { home: '', help: 'help/', premium: 'premium/', faq: 'faq/', contact: 'contact/', privacy: 'privacy/', terms: 'terms/' };
  var NAMES = {
    es: { home: 'Inicio', help: 'Ayuda', premium: 'Premium', faq: 'Preguntas frecuentes', contact: 'Contacto', privacy: 'Privacidad', terms: 'Condiciones' },
    ca: { home: 'Inici', help: 'Ajuda', premium: 'Premium', faq: 'Preguntes freqüents', contact: 'Contacte', privacy: 'Privacitat', terms: 'Condicions' },
    gl: { home: 'Inicio', help: 'Axuda', premium: 'Premium', faq: 'Preguntas frecuentes', contact: 'Contacto', privacy: 'Privacidade', terms: 'Condicións' },
    eu: { home: 'Hasiera', help: 'Laguntza', premium: 'Premium', faq: 'Ohiko galderak', contact: 'Harremanetarako', privacy: 'Pribatutasuna', terms: 'Baldintzak' },
    en: { home: 'Home', help: 'Help', premium: 'Premium', faq: 'FAQ', contact: 'Contact', privacy: 'Privacy', terms: 'Terms' },
    de: { home: 'Start', help: 'Hilfe', premium: 'Premium', faq: 'Häufige Fragen', contact: 'Kontakt', privacy: 'Datenschutz', terms: 'Bedingungen' },
    fr: { home: 'Accueil', help: 'Aide', premium: 'Premium', faq: 'Questions fréquentes', contact: 'Contact', privacy: 'Confidentialité', terms: 'Conditions' },
    it: { home: 'Home', help: 'Guida', premium: 'Premium', faq: 'Domande frequenti', contact: 'Contatti', privacy: 'Privacy', terms: 'Condizioni' },
    pt: { home: 'Início', help: 'Ajuda', premium: 'Premium', faq: 'Perguntas frequentes', contact: 'Contacto', privacy: 'Privacidade', terms: 'Termos' }
  };
  var KEY = 'fullgrader-home-lang';
  var page = document.body.getAttribute('data-page') || 'home';
  var root = document.body.getAttribute('data-root') || '';

  function href(p) { return (root + PATH[p]) || './'; }

  // Enlaces a las páginas en la barra; si no caben, se sustituyen por «Menú ⌄».
  var DD = [];
  var row = document.querySelector('.topbar-row');
  var links = null;
  if (row) {
    var brand = row.querySelector('.brand');
    var menu = document.getElementById('pageSelect');
    if (menu) menu.closest('label').classList.add('tb-menu');
    var lang = document.getElementById('langSelect');
    if (lang) lang.closest('label').classList.add('tb-langpick');
    links = document.createElement('nav');
    links.className = 'tb-links';
    links.innerHTML = BAR.map(function (p) {
      return '<a href="' + href(p) + '" data-bar="' + p + '"' + (p === page ? ' aria-current="page"' : '') + '></a>';
    }).join('');
    if (brand) brand.insertAdjacentElement('afterend', links);

    // Botón «Cómo funciona» al final de la barra (lleva a «Qué hace la app» de la portada).
    var cta = document.createElement('a');
    cta.className = 'tb-cta';
    cta.href = (root || '/') + '#app';
    row.appendChild(cta);

    // Desplegables propios en lugar de los del navegador (idioma y menú de páginas).
    if (lang) dropdown(lang, true);
    if (menu) dropdown(menu, false);
  }

  /* Desplegable propio: el <select> sigue en la página (oculto) para que todo
     lo demás funcione igual; aquí solo cambia lo que se ve y cómo se elige. */
  function dropdown(sel, isLang) {
    var label = sel.closest('label');
    var box = document.createElement('div');
    box.className = label.className + ' tb-dd' + (isLang ? ' tb-dd-lang' : ' tb-dd-menu');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tb-dd-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    while (label.firstChild && label.firstChild !== sel) btn.appendChild(label.firstChild);
    var list = document.createElement('ul');
    list.className = 'tb-dd-list';
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;
    label.parentNode.replaceChild(box, label);
    sel.hidden = true; sel.tabIndex = -1;
    box.appendChild(btn); box.appendChild(list); box.appendChild(sel);

    function build() {
      list.innerHTML = '';
      Array.prototype.forEach.call(sel.options, function (o) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.tabIndex = -1;
        li.dataset.value = o.value;
        li.setAttribute('aria-selected', o.value === sel.value ? 'true' : 'false');
        li.innerHTML = '<span></span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        li.firstChild.textContent = o.textContent;
        list.appendChild(li);
      });
      list.setAttribute('aria-label', sel.getAttribute('aria-label') || '');
    }
    function items() { return Array.prototype.slice.call(list.children); }
    function open() {
      DD.forEach(function (d) { if (d !== api) d.close(); });
      build();
      box.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      var cur = list.querySelector('[aria-selected="true"]') || list.firstChild;
      if (cur) cur.focus({ preventScroll: true });
    }
    function close(focusBtn) {
      if (!box.classList.contains('open')) return;
      box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
      if (focusBtn) btn.focus();
    }
    function choose(v) {
      close(true);
      if (v === sel.value) return;
      sel.value = v;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    btn.addEventListener('click', function () { box.classList.contains('open') ? close() : open(); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); open(); } });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) choose(li.dataset.value); });
    list.addEventListener('keydown', function (e) {
      var all = items(), i = all.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); all[Math.min(i + 1, all.length - 1)].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); all[Math.max(i - 1, 0)].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); all[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); all[all.length - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (i >= 0) choose(all[i].dataset.value); }
      else if (e.key === 'Escape' || e.key === 'Tab') { close(e.key === 'Escape'); }
    });
    var api = { close: close, box: box };
    DD.push(api);
  }
  document.addEventListener('click', function (e) {
    DD.forEach(function (d) { if (!d.box.contains(e.target)) d.close(); });
  });

  // Barra con efecto cristal y línea fina en cuanto la página se desplaza.
  var bar = document.querySelector('.topbar');
  function onScroll() { if (bar) bar.classList.toggle('scrolled', window.scrollY > 4); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function fit() {
    if (!row) return;
    row.classList.remove('c1', 'compact');
    if (row.scrollWidth > row.clientWidth + 1) row.classList.add('compact');
    if (row.scrollWidth > row.clientWidth + 1) row.classList.add('c1');
  }

  function sync(lang) {
    var n = NAMES[lang] || NAMES.en;
    var sel = document.getElementById('langSelect');
    if (sel) { sel.value = lang; sel.setAttribute('aria-label', LANGWORD[lang]); }
    var lw = document.querySelector('[data-langword]');
    if (lw) lw.textContent = LANGWORD[lang];
    var ps = document.getElementById('pageSelect');
    if (ps) {
      ps.innerHTML = PAGES.map(function (p) { return '<option value="' + p + '">' + n[p] + '</option>'; }).join('');
      ps.value = page;
      ps.setAttribute('aria-label', MENUWORD[lang]);
    }
    var pw = document.querySelector('[data-pageword]');
    if (pw) pw.textContent = MENUWORD[lang] || MENUWORD.en;
    if (links) links.querySelectorAll('[data-bar]').forEach(function (a) { a.textContent = n[a.getAttribute('data-bar')]; });
    var cta = document.querySelector('.tb-cta');
    if (cta) cta.textContent = WAIT[lang] || WAIT.en;
    var nav = links; if (nav) nav.setAttribute('aria-label', MENUWORD[lang] || MENUWORD.en);
    // Enlaces sueltos con el nombre de una página (pie, portada...).
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var p = a.getAttribute('data-nav');
      a.textContent = n[p];
      a.setAttribute('href', href(p));
    });
    fit();
  }

  function pickLang(langs) {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && langs.indexOf(fromUrl) >= 0) return fromUrl;
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved && langs.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    return langs.indexOf(nav) >= 0 ? nav : 'es';
  }

  window.FGBar = {
    sync: sync,
    pickLang: pickLang,
    onChange: function (fn) {
      var sel = document.getElementById('langSelect');
      if (sel) sel.addEventListener('change', function () { fn(sel.value); });
    },
    // Páginas sencillas: un bloque [data-lang] por idioma y un título por idioma.
    simple: function (titles) {
      var langs = Object.keys(titles);
      function set(lang) {
        document.querySelectorAll('main [data-lang]').forEach(function (el) {
          el.hidden = el.getAttribute('data-lang') !== lang;
        });
        document.documentElement.lang = lang;
        document.title = titles[lang];
        sync(lang);
        try { localStorage.setItem(KEY, lang); } catch (e) {}
      }
      this.onChange(function (l) { set(l); window.scrollTo(0, 0); });
      set(pickLang(langs));
    }
  };

  var ps = document.getElementById('pageSelect');
  if (ps) ps.addEventListener('change', function () { location.href = href(ps.value); });
  window.addEventListener('resize', fit);
})();
