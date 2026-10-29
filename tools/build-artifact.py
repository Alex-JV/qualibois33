"""Construit la version « artifact » de la page d'accueil : le même contenu sans doctype/html/head/body,
car la plateforme d'aperçu ajoute son propre squelette. Les autres fichiers sont publiés tels quels."""
import re, pathlib
site = pathlib.Path(__file__).resolve().parent.parent / 'site'
dist = pathlib.Path(__file__).resolve().parent.parent / 'dist-artifact'
dist.mkdir(exist_ok=True)
t = (site / 'index.html').read_text(encoding='utf-8')
head = re.search(r'<head>(.*?)</head>', t, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', t, re.S).group(1)
title = '<title>Maquette Qualibois 33</title>'
links = re.findall(r'<link rel="(?:preconnect|stylesheet)"[^>]*>', head)
ld = re.search(r'<script type="application/ld\+json">.*?</script>', head, re.S).group(0)
out = '\n'.join([title, '<meta name="claude:viewport-fit-sides" content="cover">', *links, ld, body])
(dist / 'index.html').write_text(out, encoding='utf-8')
print('dist-artifact/index.html', len(out), 'octets')
