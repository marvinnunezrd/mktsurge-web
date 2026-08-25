// MKT Surge — modo claro / oscuro
(function () {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function currentTheme() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateIcon() {
    btn.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mkt-theme', theme); } catch (e) {}
    updateIcon();
  }

  btn.addEventListener('click', function () {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  updateIcon();
})();

// MKT Surge — menú móvil (hamburguesa)
(function () {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('navlinks');
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    links.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (links.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cierra el menú al elegir un enlace
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Cierra el menú al tocar/hacer clic fuera de él
  document.addEventListener('click', function (e) {
    if (links.classList.contains('open') && !links.contains(e.target) && e.target !== toggle) {
      closeMenu();
    }
  });

  // Cierra el menú si la ventana vuelve a tamaño de escritorio
  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) closeMenu();
  });
})();
