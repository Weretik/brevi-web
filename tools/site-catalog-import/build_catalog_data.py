"""One-off import: old brevi.com.ua catalog snapshot -> data files of site-catalog-model."""
import re, html, json, sys, os, hashlib, subprocess, urllib.parse
from html.parser import HTMLParser
SRC, REPO = sys.argv[1], sys.argv[2]
RAW = os.path.join(SRC, 'raw'); IMG_SRC = sys.argv[3]; os.makedirs(IMG_SRC, exist_ok=True)
MODEL = os.path.join(REPO, 'libs/site/catalog/model/src/lib/data'); os.makedirs(MODEL, exist_ok=True)
SNAP = os.path.join(REPO, 'libs/site/catalog/data-access/src/lib/snapshot'); os.makedirs(SNAP, exist_ok=True)
PUB = os.path.join(REPO, 'apps/site/public/catalog/products'); os.makedirs(PUB, exist_ok=True)

def raw(url):
    p = os.path.join(RAW, hashlib.sha1(url.encode()).hexdigest()[:16] + '.html')
    return open(p, encoding='utf-8', errors='replace').read() if os.path.exists(p) else ''
def clean(t): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t))).replace(' ,', ',').replace(' .', '.').strip()
def sentence(t):
    letters = [ch for ch in t if ch.isalpha()]
    if letters and sum(ch.isupper() for ch in letters) > 0.7 * len(letters):
        t = t.lower(); t = t[0].upper() + t[1:]
    return t

class Blocks(HTMLParser):
    def __init__(s):
        super().__init__(); s.blocks = []; s.buf = ''; s.kind = None; s.items = None
    def flush(s):
        text = re.sub(r'\s+', ' ', s.buf).strip(); s.buf = ''
        if not text: return
        if s.items is not None: s.items.append(text)
        else: s.blocks.append({'type': 'heading' if s.kind == 'h' else 'paragraph', 'text': text})
    def handle_starttag(s, tag, attrs):
        if tag in ('p', 'div', 'h1', 'h2', 'h3', 'li', 'br'): s.flush()
        if tag in ('h1', 'h2', 'h3'): s.kind = 'h'
        if tag in ('ul', 'ol'): s.flush(); s.items = []
    def handle_endtag(s, tag):
        if tag in ('p', 'div', 'h1', 'h2', 'h3', 'li'): s.flush()
        if tag in ('h1', 'h2', 'h3'): s.kind = None
        if tag in ('ul', 'ol') and s.items is not None:
            if s.items: s.blocks.append({'type': 'list', 'items': s.items})
            s.items = None
    def handle_data(s, d): s.buf += d
def blocks(h):
    b = Blocks(); b.feed(h); b.flush(); return b.blocks


cats = json.load(open(os.path.join(SRC, 'categories-raw.json')))
slug_of = lambda url: urllib.parse.urlparse(url).path.strip('/').split('/')[-1]
NAMES = {
    'litnya-robocha-obuv': {'uk': 'Літнє робоче взуття', 'ru': 'Летняя рабочая обувь'},
    'filtra': {'uk': 'Фільтри', 'ru': 'Фильтры'},
    'reglany-svitera': {'uk': 'Реглани, светри', 'ru': 'Регланы, свитеры'},
    'kombinezon': {'uk': 'Комбінезони', 'ru': 'Комбинезоны'},
}
products = {}; out = []
for c in cats:
    parts = c['path'].strip('/').split('/')
    uk, ru = c['uk'], c['ru']
    if not uk['products']: continue
    ru_by_image = {}
    for p in ru.get('products', []):
        if p['images']: ru_by_image.setdefault(p['images'][0], []).append(p)
    slugs = []
    for p in uk['products']:
        s = slug_of(p['url']); slugs.append(s)
        match = ru_by_image.get(p['images'][0] if p['images'] else None, [])
        entry = products.setdefault(s, {'slug': s, 'name': {'uk': p['name'], 'ru': ''}, 'imageSrc': p['images'][0] if p['images'] else None, 'oldUrl': {'uk': p['url'], 'ru': ''}})
        if len(match) == 1 and not entry['name']['ru']:
            entry['name']['ru'] = match[0]['name']; entry['oldUrl']['ru'] = match[0]['url']
    def meta(d):
        return {'title': re.sub(r'\s*[|]\s*(Brevi|Бреві|Бреви)\s*$', '', d.get('title', '')).strip(), 'description': re.sub(r'\s*➤\s*', ' ', d.get('description', '')).strip()}
    slug = parts[-1]
    out.append({
        'slug': slug, 'parentSlug': parts[-2] if len(parts) > 1 else None,
        'name': NAMES.get(slug) or {'uk': sentence(c['menuLabel']), 'ru': sentence(ru.get('h1') or c['menuLabel'])},
        'seo': {'uk': meta(uk), 'ru': meta(ru)},
        'text': {'uk': blocks(uk.get('seoHtml', '')), 'ru': blocks(ru.get('seoHtml', ''))},
        'productSlugs': slugs,
        'oldUrl': {'uk': 'https://brevi.com.ua' + c['path'], 'ru': uk.get('ruUrl', '')},
    })
assert len({c['slug'] for c in out}) == len(out)
PU = json.load(open(os.path.join(SRC, 'product-urls.json'))) if os.path.exists(os.path.join(SRC, 'product-urls.json')) else {}
RU_BY_URL = {}
for c in cats:
    for p in c['ru'].get('products', []): RU_BY_URL[p['url']] = p['name']
def ru_h1(url):
    import subprocess, html as H
    r = subprocess.run(['curl', '-sS', '-L', '-m', '60', url], capture_output=True, text=True).stdout
    m = re.search(r'<h1[^>]*>(.*?)</h1>', r, re.S)
    return H.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else ''
for s, p in products.items():
    if p['name']['ru']: continue
    ru = PU.get(p['oldUrl']['uk'])
    if not ru: continue
    name = RU_BY_URL.get(ru) or ru_h1(ru)
    if name: p['name']['ru'] = name; p['oldUrl']['ru'] = ru
no_ru = [s for s, p in products.items() if not p['name']['ru']]
for s in no_ru: products[s]['name']['ru'] = products[s]['name']['uk']

missing = []
from PIL import Image
for s, p in products.items():
    src = p.pop('imageSrc', None); p['image'] = None
    if not src: missing.append(s); continue
    big = re.sub(r'-\d+x\d+(\.\w+)$', r'-427x723\1', src)
    local = os.path.join(IMG_SRC, s + os.path.splitext(src)[1].lower())
    for candidate in (big, src):
        if os.path.exists(local) and os.path.getsize(local) > 500: break
        subprocess.run(['curl', '-sS', '-L', '-f', '-m', '60', '-o', local, candidate], check=False)
    try:
        im = Image.open(local).convert('RGBA'); bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg.convert('RGB')
        im.thumbnail((427, 723))
        im.save(os.path.join(PUB, s + '.webp'), 'WEBP', quality=76, method=6)
        p['image'] = {'src': f'/catalog/products/{s}.webp', 'width': im.size[0], 'height': im.size[1]}
    except Exception as e:
        missing.append(s + ' ' + str(e)[:60])

def ts(path, header, name, type_, value):
    open(path, 'w', encoding='utf-8').write(header + f'export const {name}: {type_} = ' + json.dumps(value, ensure_ascii=False, indent=2) + ';\n')

by_parent = {}
for c in out: by_parent.setdefault(c['parentSlug'], []).append(c)
def node(c): return {'slug': c['slug'], 'name': c['name'], 'productCount': len(c['productSlugs']), 'children': [node(k) for k in by_parent.get(c['slug'], [])]}
NOTE = '// Generated from the catalog of the live brevi.com.ua (snapshot of 2026-11-10). Do not edit by hand: see the catalog specification.\n'
ts(os.path.join(MODEL, 'catalog-tree.ts'), NOTE + "import type { CatalogTreeNode } from '../catalog-tree';\n\n", 'CATALOG_TREE_DATA', 'readonly CatalogTreeNode[]', [node(c) for c in by_parent[None]])
ts(os.path.join(SNAP, 'categories.ts'), NOTE + "import type { CatalogCategory } from '@site/catalog/model';\n\n", 'CATEGORY_SNAPSHOT', 'readonly CatalogCategory[]', [{k: v for k, v in c.items() if k != 'oldUrl'} for c in out])
ts(os.path.join(SNAP, 'products.ts'), NOTE + "import type { CatalogProductCard } from '@site/catalog/model';\n\n", 'PRODUCT_SNAPSHOT', 'readonly CatalogProductCard[]', [{k: v for k, v in p.items() if k != 'oldUrl'} for p in sorted(products.values(), key=lambda p: p['slug'])])
json.dump({'categories': {c['slug']: c['oldUrl'] for c in out}, 'products': {s: p['oldUrl'] for s, p in products.items()}}, open(os.path.join(SRC, 'old-urls.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'categories', len(products), 'products; ru name not matched:', len(no_ru), no_ru[:8], 'missing images:', missing)
