/* Barra fija común a toda la web: enlaces a las páginas (o «Menú ⌄» si no caben) e idioma («Idioma ⌄»).
   Cada página llama a FGBar.sync(idioma) cuando cambia de idioma. */
(function () {
  var LANGWORD = { es: 'Idioma', ca: 'Idioma', gl: 'Idioma', eu: 'Hizkuntza', en: 'Language', de: 'Sprache', fr: 'Langue', it: 'Lingua', pt: 'Idioma' };
  var MENUWORD = { es: 'Menú', ca: 'Menú', gl: 'Menú', eu: 'Menua', en: 'Menu', de: 'Menü', fr: 'Menu', it: 'Menu', pt: 'Menu' };
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
  }

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
