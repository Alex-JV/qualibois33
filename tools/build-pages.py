# -*- coding: utf-8 -*-
"""Génère les pages métier du site à partir d'un même gabarit (en-tête, menu, pied de page identiques).
Usage : python3 tools/build-pages.py  →  écrit site/<page>.html pour chaque entrée de PAGES."""
import pathlib, html

SITE = pathlib.Path(__file__).resolve().parent.parent / 'site'

NAV = [
    ('charpente.html', 'Charpente'), ('couverture.html', 'Couverture'), ('zinguerie.html', 'Zinguerie'),
    ('ossature-bois.html', 'Ossature bois'), ('amenagement-exterieur.html', 'Aménagement extérieur'),
    ('avant-toit.html', 'Avant-toit'), ('gouttiere-aluminium.html', 'Gouttière alu'),
    ('index.html#realisations', 'Réalisations'), ('index.html#equipe', "L'équipe"), ('index.html#contact', 'Contact'),
]

# Cartes « autres métiers » (image, titre, phrase)
CARTES = {
    'charpente': ('charpente-carport.jpg', 'Charpente', 'Charpentes traditionnelles et industrielles, en neuf comme en rénovation.'),
    'couverture': ('couverture-fenetre-toit.jpg', 'Couverture', 'Tuiles, toitures plates EPDM, isolation et fenêtres de toit.'),
    'zinguerie': ('zinguerie-cheneau-zinc.jpg', 'Zinguerie', 'Gouttières, chéneaux, abergements et soudure zinc.'),
    'ossature-bois': ('amenagement-pool-house.jpg', 'Ossature bois', 'Extensions, abris, pool houses et constructions bois sur mesure.'),
    'amenagement-exterieur': ('amenagement-terrasse.jpg', 'Aménagement extérieur', 'Terrasses, pergolas, cabanons et locaux techniques en bois.'),
    'avant-toit': ('hero-charpente-1500.jpg', 'Avant-toit', 'Auvents, préaux et débords de toit en charpente apparente.'),
    'gouttiere-aluminium': ('gouttiere-camion-atelier-1030.jpg', 'Gouttière aluminium', 'Profilée sur place, sans soudure, plusieurs coloris.'),
}

SPRITE = '''<svg hidden aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-tel" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 22s7-7.1 7-12a7 7 0 1 0-14 0c0 4.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></symbol>
  <symbol id="i-horloge" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></symbol>
  <symbol id="i-fleche" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-devis" viewBox="0 0 24 24"><path d="M6 2h8l6 6v14H6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></symbol>
</svg>'''

def e(s):
    return html.escape(s, quote=True)

def head(p):
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{e(p['title'])}</title>
<meta name="description" content="{e(p['description'])}">
<link rel="canonical" href="https://qualibois33.com/{p['slug']}.html">
<meta property="og:title" content="{e(p['title'])}">
<meta property="og:description" content="{e(p['sous'])}">
<meta property="og:image" content="https://qualibois33.com/img/{p['hero']}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
'''

def header(p):
    items = ''
    for h, t in NAV:
        cur = ' aria-current="page"' if h == p['slug'] + '.html' else ''
        items += f'\n    <li><a href="{h}"{cur}>{e(t)}</a></li>'
    return f'''{SPRITE}

<a class="skip" href="#contenu">Aller au contenu</a>
<div class="ruban"><strong>Maquette v1</strong> · textes, chiffres et photos provisoires, à valider avec Qualibois 33</div>

<div class="topbar">
  <div class="container">
    <div class="gauche">Charpente, couverture, zinguerie et aménagement extérieur à Cestas, en Gironde</div>
    <div class="droite">
      <a href="tel:+33666713607"><svg class="ico"><use href="#i-tel"/></svg>06 66 71 36 07</a>
      <a href="https://www.instagram.com/qualibois_33/" target="_blank" rel="noopener"><svg class="ico"><use href="#i-instagram"/></svg>Instagram</a>
    </div>
  </div>
</div>

<header class="entete">
  <div class="container">
    <a class="logo" href="index.html" aria-label="Qualibois 33, accueil"><img src="img/logo-qualibois33.png" alt="Qualibois 33, charpente et couverture" width="300" height="76"></a>
    <div class="actions">
      <a class="tel" href="tel:+33666713607"><svg class="ico"><use href="#i-tel"/></svg>06 66 71 36 07</a>
      <a class="btn btn-plein" href="index.html#contact"><svg class="ico"><use href="#i-devis"/></svg>Devis gratuit</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu"><span></span>Menu</button>
    </div>
  </div>
</header>

<nav class="nav" id="menu" aria-label="Nos métiers">
  <button class="fermer" type="button">Fermer</button>
  <ul>{items}
  </ul>
</nav>

<main id="contenu">
'''

def hero(p):
    if p.get('hero_mobile'):
        img = f'<picture><source media="(max-width: 1023px)" srcset="img/{p["hero_mobile"]}"><img class="fond" src="img/{p["hero"]}" alt="" fetchpriority="high"></picture>'
    else:
        img = f'<img class="fond" src="img/{p["hero"]}" alt="" fetchpriority="high">'
    return f'''
<section class="hero hero-page" aria-labelledby="titre-page">
  {img}
  <div class="container">
    <nav class="fil" aria-label="Fil d'Ariane"><a href="index.html">Accueil</a><span aria-hidden="true">›</span><span>{e(p['h1'])}</span></nav>
    <p class="kicker">{e(p['kicker'])}</p>
    <h1 id="titre-page">{e(p['h1'])}</h1>
    <p class="sous">{e(p['sous'])}</p>
    <div class="actions">
      <a class="btn btn-plein" href="index.html#contact">Demander un devis gratuit</a>
      <a class="btn btn-contour" href="tel:+33666713607"><svg class="ico"><use href="#i-tel"/></svg>06 66 71 36 07</a>
    </div>
  </div>
</section>
'''

def intro(p):
    paras = ''.join(f'\n      <p>{e(x)}</p>' for x in p['intro_p'])
    coches = ''.join(f'\n        <li><svg class="ico"><use href="#i-check"/></svg>{e(x)}</li>' for x in p['coches'])
    note = f'\n      <p class="note-provisoire">{e(p["note"])}</p>' if p.get('note') else ''
    return f'''
<section class="section">
  <div class="container deux-colonnes">
    <div class="texte">
      <p class="kicker">Notre savoir-faire</p>
      <h2 class="titre">{e(p['intro_h2'])}</h2>{paras}
      <ul class="liste-coches">{coches}
      </ul>{note}
    </div>
    <div class="photo"><img src="img/{p['intro_img'][0]}" alt="{e(p['intro_img'][1])}" loading="lazy"></div>
  </div>
</section>
'''

def colonnes(p):
    cols = ''.join(f'''
      <div class="colonne">
        <h3>{e(t)}</h3>
        <p>{e(x)}</p>
      </div>''' for t, x in p['colonnes'])
    return f'''
<section class="section sable">
  <div class="container">
    <div class="entete-section">
      <p class="kicker">Nos prestations</p>
      <h2 class="titre">{e(p['colonnes_h2'])}</h2>
    </div>
    <div class="colonnes">{cols}
    </div>
  </div>
</section>
'''

def etapes(p):
    if not p.get('etapes'):
        return ''
    items = ''.join(f'\n      <div class="etape"><h3>{e(t)}</h3><p>{e(x)}</p></div>' for t, x in p['etapes'])
    return f'''
<section class="section">
  <div class="container">
    <div class="entete-section">
      <p class="kicker">Comment ça se passe</p>
      <h2 class="titre">{e(p['etapes_h2'])}</h2>
    </div>
    <div class="etapes">{items}
    </div>
  </div>
</section>
'''

def galerie(p):
    figs = ''.join(f'\n      <figure><img src="img/{img}" alt="{e(alt)}" loading="lazy"><figcaption><strong>{e(cap)}</strong>Gironde</figcaption></figure>'
                   for img, alt, cap in p['galerie'])
    fond = '' if p.get('etapes') else ' sable'
    fond = ' sable' if not p.get('etapes') else ' sable'
    return f'''
<section class="section{fond}">
  <div class="container">
    <div class="entete-section">
      <p class="kicker">Réalisations</p>
      <h2 class="titre">{e(p['galerie_h2'])}</h2>
    </div>
    <div class="galerie quatre">{figs}
    </div>
  </div>
</section>
'''

def autres(p):
    cards = ''
    for slug in p['autres']:
        img, titre, phrase = CARTES[slug]
        cards += f'''
      <article class="carte"><div class="visuel"><img src="img/{img}" alt="" loading="lazy"></div><div class="corps"><h3><a href="{slug}.html">{e(titre)}</a></h3><p>{e(phrase)}</p><a class="lien" href="{slug}.html">En savoir plus <svg class="ico"><use href="#i-fleche"/></svg></a></div></article>'''
    return f'''
<section class="section">
  <div class="container">
    <div class="entete-section">
      <p class="kicker">Nos autres métiers</p>
      <h2 class="titre">Toute la toiture par une seule équipe</h2>
    </div>
    <div class="cartes compactes">{cards}
    </div>
  </div>
</section>
'''

def cta(p):
    return f'''
<section class="cta">
  <div class="container">
    <div>
      <h2>{e(p['cta'])}</h2>
      <p>Visite sur place, conseils et devis détaillé, sans engagement.</p>
    </div>
    <a class="btn btn-blanc" href="index.html#contact">Demander un devis</a>
  </div>
</section>

</main>
'''

FOOTER = '''
<footer class="footer">
  <div class="container haut">
    <div>
      <div class="chip"><img src="img/logo-qualibois33.png" alt="Qualibois 33" width="300" height="76"></div>
      <p>Entreprise artisanale de charpente, couverture, zinguerie et construction bois à Cestas, en Gironde. Intervention chez les particuliers, en neuf et en rénovation.</p>
    </div>
    <div>
      <h3>Nos métiers</h3>
      <ul>
        <li><a href="charpente.html">Charpente</a></li><li><a href="couverture.html">Couverture</a></li><li><a href="zinguerie.html">Zinguerie</a></li><li><a href="ossature-bois.html">Ossature bois</a></li><li><a href="amenagement-exterieur.html">Aménagement extérieur</a></li><li><a href="avant-toit.html">Avant-toit</a></li><li><a href="gouttiere-aluminium.html">Gouttière aluminium</a></li>
      </ul>
    </div>
    <div>
      <h3>L'entreprise</h3>
      <ul>
        <li><a href="index.html#entreprise">Qui sommes-nous</a></li><li><a href="index.html#realisations">Réalisations</a></li><li><a href="index.html#equipe">L'équipe</a></li><li><a href="index.html#zone">Zone d'intervention</a></li><li><a href="index.html#contact">Contact et devis</a></li><li><a href="#">Mentions légales</a></li><li><a href="#">Politique de confidentialité</a></li>
      </ul>
    </div>
    <div>
      <h3>Contact</h3>
      <ul>
        <li class="bloc"><svg class="ico"><use href="#i-pin"/></svg><span>1 chemin des Tenques<br>33610 Cestas</span></li>
        <li class="bloc"><svg class="ico"><use href="#i-tel"/></svg><a href="tel:+33666713607">06 66 71 36 07</a></li>
        <li class="bloc"><svg class="ico"><use href="#i-mail"/></svg><a href="mailto:qualibois33@gmail.com">qualibois33@gmail.com</a></li>
        <li class="bloc"><svg class="ico"><use href="#i-horloge"/></svg><span>Lundi au samedi, 8h à 18h</span></li>
        <li class="bloc"><svg class="ico"><use href="#i-instagram"/></svg><a href="https://www.instagram.com/qualibois_33/" target="_blank" rel="noopener">@qualibois_33</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bas">
    <div class="container">
      <span>© <span data-annee>2026</span> Qualibois 33 · SARL au capital de 2 000 € · SIREN 910 187 566</span>
      <span>Maquette v1 · <a href="#">Mentions légales</a></span>
    </div>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
'''

def build(p):
    return head(p) + header(p) + hero(p) + intro(p) + colonnes(p) + etapes(p) + galerie(p) + autres(p) + cta(p) + FOOTER

from pages_data import PAGES
if __name__ == '__main__':
    for p in PAGES:
        out = SITE / f"{p['slug']}.html"
        out.write_text(build(p), encoding='utf-8')
        print('écrit', out.name, len(out.read_text(encoding='utf-8')), 'octets')
