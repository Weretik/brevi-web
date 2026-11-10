import re, html, json, sys, time, subprocess, hashlib, os
OUT = sys.argv[1]
RAW = os.path.join(OUT, 'raw')
BASE = 'https://brevi.com.ua'
SKIP = ('/robochyj-odyag/', '/brenduvannya-specodyagu/', '/pro-nas')

def fetch(url):
    name = hashlib.sha1(url.encode()).hexdigest()[:16] + '.html'
    path = os.path.join(RAW, name)
    if not os.path.exists(path) or os.path.getsize(path) < 2000:
        subprocess.run(['curl', '-sS', '-L', '-m', '60', '-o', path, url], check=True)
        time.sleep(0.4)
    return open(path, encoding='utf-8', errors='replace').read()

def clean(t):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t))).strip()

def parse(page):
    d = {}
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S); d['h1'] = clean(m.group(1)) if m else ''
    m = re.search(r'<title>(.*?)</title>', page, re.S); d['title'] = clean(m.group(1)) if m else ''
    m = re.search(r'<meta name="description" content="([^"]*)"', page); d['description'] = html.unescape(m.group(1)) if m else ''
    m = re.search(r'hreflang="ru" href="([^"]+)"', page); d['ruUrl'] = m.group(1) if m else ''
    m = re.search(r'rel="canonical"[^>]*href="([^"]+)"|href="([^"]+)" rel="canonical"', page); d['canonical'] = (m.group(1) or m.group(2)) if m else ''
    i = page.find('cat-desc')
    d['seoHtml'] = ''
    if i > 0:
        j = page.find('<footer', i)
        d['seoHtml'] = page[page.find('>', i) + 1: j if j > 0 else i + 20000].strip()
    m = re.search(r'Показано[^<]*?(\d+)\s*\(', page); d['total'] = int(m.group(1)) if m else None
    prods = []
    h = page.find('<h1'); e = page.find('Показано', h); listing = page[h: e if e > 0 else h]
    for b in re.split(r'<div class="grid-product-item', listing)[1:]:
        b = b[:6000]
        hrefs = re.findall(r'<a[^>]*href="([^"]+)"', b)
        imgs = re.findall(r'<img[^>]*(?:data-src|src)="([^"]+)"', b)
        names = [clean(t) for t in re.findall(r'<a[^>]*>(.*?)</a>', b, re.S)]
        names = [n for n in names if n and n not in ('Купити', 'Купить')]
        pm = re.search(r'(від|от)\s*([\d\s]+)\s*грн', clean(b))
        if hrefs:
            prods.append({'url': hrefs[0], 'name': names[0] if names else '', 'images': imgs[:2], 'priceFrom': int(pm.group(2).replace(' ', '')) if pm else None})
    d['products'] = prods
    return d

first = fetch(BASE + '/specodyag-litnij')
a = first.find('<div class="categories">'); b = first.find('<ul class="dropdown-menu"', a)
links = [(h.replace(BASE, ''), clean(t)) for h, t in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', first[a:b], re.S)]
links = [(h, t) for h, t in links if not h.startswith(SKIP) and h != '#']
cats = []
for path, label in links:
    uk = parse(fetch(BASE + path + '?limit=1000'))
    ru = parse(fetch(uk['ruUrl'] + '?limit=1000')) if uk['ruUrl'] else {}
    cats.append({'path': path, 'menuLabel': label, 'uk': uk, 'ru': ru})
    print(path, uk['h1'], '|', ru.get('h1'), len(uk['products']), len(ru.get('products', [])), uk['total'], len(uk['seoHtml']), file=sys.stderr)
json.dump(cats, open(os.path.join(OUT, 'categories-raw.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
