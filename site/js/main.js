// Qualibois 33 — maquette v1 : menu mobile, ombre d'en-tête, formulaire de démonstration.
(function () {
  // Arrivée par un lien : toujours démarrer en haut de la page (certains navigateurs, surtout en fichier local,
  // restaurent l'ancienne position de défilement). Le retour arrière du navigateur garde son comportement normal.
  try {
    var navType = performance.getEntriesByType('navigation')[0];
    if (navType && navType.type === 'navigate' && !location.hash) {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      var html = document.documentElement, ancien = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      window.addEventListener('load', function () { window.scrollTo(0, 0); html.style.scrollBehavior = ancien; });
    }
  } catch (e) {}
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  var fermer = document.querySelector('.nav .fermer');
  function fermerMenu() {
    nav.classList.remove('ouvert');
    document.body.classList.remove('menu-ouvert');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('ouvert');
      document.body.classList.toggle('menu-ouvert', ouvert);
      burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', fermerMenu); });
    if (fermer) fermer.addEventListener('click', fermerMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermerMenu(); });
  }
  var form = document.getElementById('form-devis');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = document.getElementById('form-message');
      if (m) {
        m.hidden = false;
        m.textContent = 'Maquette : sur le site final, votre demande sera envoyée par email à Qualibois 33, et vous recevrez une copie de confirmation.';
        m.focus();
      }
    });
  }
  document.querySelectorAll('[data-annee]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
