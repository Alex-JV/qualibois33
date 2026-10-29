# Site Qualibois 33 — refonte

- `docs/releve-sites-2026-10-25.md` : relevé complet du site actuel (qualibois33.com) et du site modèle (charpente-mathieu.fr), avec la liste des informations à demander au cousin.
- `site/` : le site statique (HTML, CSS, JS, images). Pour le voir : ouvrir `site/index.html` dans un navigateur, ou lancer `python3 -m http.server 8765 --directory site` puis aller sur http://127.0.0.1:8765/.
- `site/img/` : photos reprises du site actuel (compressées) et logo. Les originaux en pleine résolution sont à demander.
- `tools/pages_data.py` : textes de chaque page métier ; `tools/build-pages.py` : génère les 7 pages métier dans `site/` à partir d'un gabarit commun (à relancer après toute modification des textes : `cd tools && python3 build-pages.py`).
- `tools/build-artifact.py` : génère `dist-artifact/index.html`, version de la page d'accueil pour l'aperçu partageable sur claude.ai (sans doctype ni balises head/body, car la plateforme ajoute les siennes).
- `dist-artifact/` : fichier généré, ne pas modifier à la main.

État : maquette v1.1 (accueil + 7 pages métier : Charpente, Couverture, Zinguerie, Ossature bois, Aménagement extérieur, Avant-toit, Gouttière aluminium). Textes, chiffres et photos provisoires, à valider avec Qualibois 33.

## Mise en ligne de la maquette (GitHub Pages)

Dépôt : https://github.com/Alex-JV/qualibois33 (compte Alex-JV, clé SSH `github.com-JV`).
Lien public : https://alex-jv.github.io/qualibois33/

Chaque `git push` sur `main` republie le dossier `site/` via `.github/workflows/pages.yml`
(une minute environ). Les pages portent une balise `noindex` tant que c'est une maquette.
