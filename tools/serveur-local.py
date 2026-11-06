"""Serveur de prévisualisation locale sans cache : chaque rechargement montre la dernière version.
Lancer depuis n'importe où :  python3 tools/serveur-local.py   puis ouvrir http://127.0.0.1:8765/"""
import functools, http.server, pathlib

SITE = pathlib.Path(__file__).resolve().parent.parent / 'site'

class SansCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()
    def log_message(self, *args):
        pass

http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(SansCache, directory=str(SITE))).serve_forever()
