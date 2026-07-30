# Sunshine Yards — Setup Guide

A one-page lead-capture site for sunshineyards.com. Static, fast, and free to run.

## What's in here

- `index.html` — the whole website (one file)
- `apps-script/Code.gs` — the free Google backend that collects your leads

## 1. Set up the lead sheet (5 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a blank spreadsheet. Name it "Sunshine Yards Leads".
2. In the menu: **Extensions → Apps Script**.
3. Delete the placeholder code and paste in everything from `apps-script/Code.gs`.
4. (Optional) Set `NOTIFY_EMAIL` at the top to your email to get pinged on every complete lead.
5. Click **Deploy → New deployment → type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy**, authorize it, and copy the **Web app URL**.
7. Open `index.html`, find `SCRIPT_URL` near the bottom, and paste your URL in place of `PASTE_YOUR_APPS_SCRIPT_URL_HERE`.

Your sheet will now fill itself with one row per person:

| Created | Email | Address | Status | Updated |
|---|---|---|---|---|
| ... | jane@x.com | 12 Oak Ln | **Needs estimate** | ... |
| ... | bob@y.com | | **Address fall off** | ... |

- "Address fall off" = entered email, bailed before the address (follow up later!)
- "Needs estimate" = full lead — measure it on Google Earth and email the estimate

No estimates are automated. The site only collects; you reply personally.

## 2. Add the background video

Drop a file named `lawn.mp4` next to `index.html`. Free fresh-cut/mowing clips:
[pexels.com/videos](https://www.pexels.com/videos/) or [coverr.co](https://coverr.co) — search "lawn mowing".

Tips: keep it under ~8 MB, landscape orientation. Until the video is added, the site
shows animated mow-stripes instead, so it never looks broken.

## 3. Publish on GitHub Pages

1. Create a repo (e.g. `sunshine-yards`) and upload `index.html` + `lawn.mp4`.
2. Repo **Settings → Pages → Source: Deploy from a branch**, pick `main`, folder `/ (root)`. Save.
3. Your site is live at `https://<username>.github.io/sunshine-yards/`.

### Point sunshineyards.com at it

1. In **Settings → Pages → Custom domain**, enter `sunshineyards.com` and save
   (this creates a `CNAME` file in the repo).
2. At your domain registrar, add these DNS records:
   - Four **A records** for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME record** for `www` → `<username>.github.io`
3. Back in GitHub Pages settings, tick **Enforce HTTPS** once DNS propagates (can take up to a day).

## 4. Make it yours

- **Towns list**: edit the `<ul class="towns">` section in `index.html`.
- **Colors**: all in the `:root` block at the top of the CSS (`--pine`, `--soil`, `--sun`...).
- **Copy**: headline and section text are plain HTML — edit freely.
