# jbondata.com

Personal portfolio and resume site. Built with vanilla HTML, CSS, and JS.

- **Live (GitHub Pages):** https://jbondata.github.io  
- **Custom domain:** https://jbondata.com (after DNS is configured)

## Repo

- **GitHub:** https://github.com/jbondata/jbondata.github.io  
- **Branch:** `main` — site is served from the root.

## One-time: Enable GitHub Pages

1. Open **Settings** → **Pages** for this repo.
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. **Branch:** `main` → **/ (root)** → Save.

The site will be live at https://jbondata.github.io within a couple of minutes.

## Link your domain (jbondata.com)

The repo already contains a **CNAME** file with `jbondata.com`. To serve the site at your domain:

### 1. Add the custom domain in GitHub

1. In the repo: **Settings** → **Pages**.
2. Under **Custom domain**, enter `jbondata.com` and **Save**.
3. (Optional) Check **Enforce HTTPS** after DNS has propagated.

### 2. Configure DNS at your domain registrar

Where you bought jbondata.com (e.g. Namecheap, Cloudflare, Google Domains), add:

**Option A — Recommended (CNAME for www, A records for apex)**

| Type | Name/Host | Value/Points to        |
|------|------------|------------------------|
| CNAME | www      | `jbondata.github.io`   |
| A     | @        | `185.199.108.153`      |
| A     | @        | `185.199.109.153`      |
| A     | @        | `185.199.110.153`      |
| A     | @        | `185.199.111.153`      |

**Option B — Apex only (no www)**

| Type | Name/Host | Value           |
|------|-----------|-----------------|
| A    | @         | `185.199.108.153` |
| A    | @         | `185.199.109.153` |
| A    | @         | `185.199.110.153` |
| A    | @         | `185.199.111.153` |

**If your registrar supports ALIAS/ANAME for apex:**  
- Set apex (`@` or `jbondata.com`) to `jbondata.github.io` instead of the four A records.

DNS can take from a few minutes up to 48 hours. After it propagates, GitHub will show a green check next to your custom domain and HTTPS will be available.

## Local dev

Serve locally, e.g.:

```bash
python -m http.server 8765
```

Then open http://localhost:8765 .

## Deploy

Push to `main`; GitHub Pages rebuilds automatically.

```bash
git add .
git commit -m "Update site"
git push
```
