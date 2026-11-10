import re, json, sys, time, subprocess, hashlib, os
OUT = sys.argv[1]; RAW = os.path.join(OUT, 'raw')
def fetch(url):
    path = os.path.join(RAW, hashlib.sha1(url.encode()).hexdigest()[:16] + '.html')
    if not os.path.exists(path) or os.path.getsize(path) < 2000:
        subprocess.run(['curl', '-sS', '-L', '-m', '60', '-o', path, url], check=False)
        time.sleep(0.35)
    return open(path, encoding='utf-8', errors='replace').read() if os.path.exists(path) else ''
cats = json.load(open(os.path.join(OUT, 'categories-raw.json')))
urls = sorted({p['url'] for c in cats for p in c['uk']['products']})
index = {}
for n, u in enumerate(urls):
    page = fetch(u)
    m = re.search(r'hreflang="ru" href="([^"]+)"', page)
    ru = m.group(1) if m else ''
    if ru: fetch(ru)
    index[u] = ru
    if n % 40 == 0: print(n, len(urls), flush=True)
json.dump(index, open(os.path.join(OUT, 'product-urls.json'), 'w'), ensure_ascii=False, indent=1)
print('done', len(index), sum(1 for v in index.values() if v))
