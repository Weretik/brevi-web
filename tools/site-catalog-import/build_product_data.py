"""One-off import: product pages of the old brevi.com.ua -> product details snapshot of the site."""
import re, html, json, sys, os, hashlib
from html.parser import HTMLParser
from PIL import Image

SRC, REPO = sys.argv[1], sys.argv[2]
RAW = os.path.join(SRC, 'raw')
SNAP = os.path.join(REPO, 'libs/site/catalog/data-access/src/lib/snapshot')
PUB = os.path.join(REPO, 'apps/site/public/catalog/products')

def raw(url):
    p = os.path.join(RAW, hashlib.sha1(url.encode()).hexdigest()[:16] + '.html')
    return open(p, encoding='utf-8', errors='replace').read() if os.path.exists(p) else ''
def text(t): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t))).replace(' ,', ',').replace(' .', '.').replace(' ;', ';').replace(' :', ':').strip()

BLOCK = ('p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'li', 'br', 'article', 'hr', 'tr')
HEAD = ('h1', 'h2', 'h3', 'h4', 'h5')
class Blocks(HTMLParser):
    """Paragraphs, headings and lists; a paragraph that opens with a bold «Label:» keeps it as `lead`."""
    def __init__(s):
        super().__init__(); s.blocks = []; s.buf = ''; s.lead = ''; s.bold = 0; s.kind = None; s.items = None
    def flush(s):
        lead = re.sub(r'\s+', ' ', s.lead).strip(); body = re.sub(r'\s+', ' ', s.buf).strip(); s.buf = ''; s.lead = ''
        if lead and not lead.endswith(':'): body = (lead + ' ' + body).strip(); lead = ''
        if lead and not body: body = lead; lead = ''
        if not body: return
        body = body.replace(' ,', ',').replace(' .', '.').replace(' ;', ';')
        if s.items is not None: s.items.append((lead + ' ' + body).strip())
        elif s.kind == 'h': s.blocks.append({'type': 'heading', 'text': (lead + ' ' + body).strip()})
        elif lead: s.blocks.append({'type': 'paragraph', 'lead': lead, 'text': body})
        else: s.blocks.append({'type': 'paragraph', 'text': body})
    def handle_starttag(s, tag, attrs):
        if tag in BLOCK: s.flush()
        if tag in HEAD: s.kind = 'h'
        if tag in ('strong', 'b'): s.bold += 1
        if tag in ('ul', 'ol'): s.flush(); s.items = []
    def handle_endtag(s, tag):
        if tag in BLOCK: s.flush()
        if tag in HEAD: s.kind = None
        if tag in ('strong', 'b'): s.bold = max(0, s.bold - 1)
        if tag in ('ul', 'ol') and s.items is not None:
            if s.items: s.blocks.append({'type': 'list', 'items': s.items})
            s.items = None
    def handle_data(s, d):
        if s.bold and not s.buf.strip() and s.kind != 'h': s.lead += d
        else: s.buf += d
def blocks(h):
    b = Blocks(); b.feed(h); b.flush(); return b.blocks

def parse(page):
    if '<h1' not in page: return None
    d = {}
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S); d['name'] = text(m.group(1))
    m = re.search(r'<title>(.*?)</title>', page, re.S); title = text(m.group(1)) if m else ''
    d['title'] = re.sub(r'\s*[|]\s*(Brevi|Бреві|Бреви)\s*$', '', title).strip()
    m = re.search(r'<meta name="description" content="([^"]*)"', page); d['metaDescription'] = re.sub(r'\s*➤\s*', ' ', html.unescape(m.group(1))).strip() if m else ''
    m = re.search(r'<strong>Модель:</strong>\s*([^<]*)<', page); d['model'] = text(m.group(1)) if m else ''
    m = re.search(r'<div class="desc">(.*?)<p class="text-end">', page, re.S)
    short = re.sub(r'<ul class="list-unstyled">.*?</ul>', '', m.group(1), count=1, flags=re.S) if m else ''
    d['summary'] = blocks(short)
    m = re.search(r'id="tab-description"[^>]*>(.*?)(?:<div class="tab-pane|</div>\s*</div>\s*</div>)', page, re.S)
    d['description'] = blocks(m.group(1)) if m else []
    groups = []
    m = re.search(r'id="tab-specification">(.*?)</table>\s*</div>', page, re.S)
    if m:
        for part in re.split(r'<thead>', m.group(1))[1:]:
            g = re.search(r'<strong>(.*?)</strong>', part, re.S)
            rows = []
            for a, b in re.findall(r'<tr>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*</tr>', part.split('<tbody>', 1)[-1], re.S):
                a, b = text(a), text(b).rstrip(';').strip()
                if a and b: rows.append({'name': a, 'value': b})
            if rows: groups.append({'title': text(g.group(1)) if g else '', 'rows': rows})
    d['specs'] = groups
    return d

def card_photo(slug):
    """The photo the listing card already has; the gallery of the old page is not copied."""
    path = os.path.join(PUB, slug + '.webp')
    if not os.path.exists(path): return []
    size = Image.open(path).size
    return [{'src': f'/catalog/products/{slug}.webp', 'width': size[0], 'height': size[1]}]

old = json.load(open(os.path.join(SRC, 'old-urls.json')))['products']
cats = json.load(open(os.path.join(SRC, 'categories-raw.json')))
# The deepest category that lists a product is its home category for breadcrumbs.
home = {}
for c in sorted(cats, key=lambda c: c['path'].count('/')):
    for p in c['uk']['products']: home[p['url']] = c['path'].strip('/').split('/')[-1]

out = []; problems = []
for slug in sorted(old):
    urls = old[slug]; uk = parse(raw(urls['uk'])); ru = parse(raw(urls['ru'])) if urls.get('ru') else None
    if not uk: problems.append(slug + ' no uk page'); continue
    if not ru: problems.append(slug + ' no ru page'); ru = uk
    photos = card_photo(slug)
    if not photos: problems.append(slug + ' no photos')
    pick = lambda k: {'uk': uk[k], 'ru': ru[k]}
    out.append({
        'slug': slug, 'categorySlug': home.get(urls['uk'], ''), 'model': uk['model'] or None,
        'name': pick('name'), 'seo': {l: {'title': d['title'], 'description': d['metaDescription']} for l, d in (('uk', uk), ('ru', ru))},
        'photos': photos, 'summary': pick('summary'), 'description': pick('description'), 'specs': pick('specs'),
    })

NOTE = '// Generated from the product pages of the live brevi.com.ua (snapshot of 2026-11-10). Do not edit by hand: see the catalog specification.\n'
open(os.path.join(SNAP, 'product-details.ts'), 'w', encoding='utf-8').write(
    NOTE + "import type { CatalogProduct } from '@site/catalog/model';\n\n" + 'export const PRODUCT_DETAILS_SNAPSHOT: readonly CatalogProduct[] = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n')
print(len(out), 'products;', sum(len(p['photos']) for p in out), 'photos; problems:', problems)
