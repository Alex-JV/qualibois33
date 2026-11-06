/* Visionneuse de la page Réalisations : clic sur une photo pour l'agrandir, flèches pour naviguer dans le même chantier. */
(function () {
  'use strict';
  var v = document.querySelector('.visionneuse');
  if (!v) return;
  var img = v.querySelector('img'), legende = v.querySelector('figcaption');
  var serie = [], index = 0, retour = null;

  function afficher() {
    var source = serie[index];
    img.src = source.getAttribute('src');
    img.alt = source.alt;
    legende.textContent = source.alt + (serie.length > 1 ? '  ·  ' + (index + 1) + ' / ' + serie.length : '');
    v.querySelector('.v-prec').hidden = v.querySelector('.v-suiv').hidden = serie.length < 2;
  }
  function ouvrir(bouton) {
    serie = Array.prototype.slice.call(bouton.closest('.chantier-photos').querySelectorAll('img'));
    index = serie.indexOf(bouton.querySelector('img'));
    retour = bouton;
    afficher();
    v.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    v.querySelector('.v-fermer').focus();
  }
  function fermer() {
    v.hidden = true;
    document.documentElement.style.overflow = '';
    if (retour) retour.focus();
  }
  function aller(pas) { index = (index + pas + serie.length) % serie.length; afficher(); }

  document.querySelectorAll('.chantier-photos .agrandir').forEach(function (b) {
    b.addEventListener('click', function () { ouvrir(b); });
  });
  v.querySelector('.v-fermer').addEventListener('click', fermer);
  v.querySelector('.v-prec').addEventListener('click', function () { aller(-1); });
  v.querySelector('.v-suiv').addEventListener('click', function () { aller(1); });
  v.addEventListener('click', function (ev) { if (ev.target === v) fermer(); });
  document.addEventListener('keydown', function (ev) {
    if (v.hidden) return;
    if (ev.key === 'Escape') fermer();
    else if (ev.key === 'ArrowLeft') aller(-1);
    else if (ev.key === 'ArrowRight') aller(1);
  });
})();
