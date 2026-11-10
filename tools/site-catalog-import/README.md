# Site catalog import

One-off scripts that copy the catalog of the old `brevi.com.ua` into the snapshot the Next.js site reads. See the [catalog specification](../../docs/specs/site/catalog/001-catalog/README.md).

Run them in this order with a work folder outside the repository (`<work>`):

1. `python3 scrape_categories.py <work>` reads the category pages in both languages and writes `categories-raw.json` and `old-urls.json`.
2. `python3 fetch_products.py <work>` reads the product pages and writes `product-urls.json` (Ukrainian product address to Russian one).
3. `python3 build_catalog_data.py <work> <repo> <image-cache>` writes the category tree, the category and product snapshot, and the product photos (`apps/site/public/catalog/products`).

The scripts need Python 3 with Pillow and `curl`. Run `npx prettier --write` on the generated `.ts` files afterwards.
