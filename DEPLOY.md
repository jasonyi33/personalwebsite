# Deploying JASON-OS to Vercel + connecting jasonyi.live

Step-by-step. Estimated total time: ~15 minutes (most of it is waiting for DNS to propagate).

Repo: <https://github.com/jasonyi33/personalwebsite>
Target domain: `jasonyi.live` (Namecheap)

---

## Part 1 — Create the Vercel project

### 1. Sign in & import the repo

1. Go to <https://vercel.com/new>
2. Sign in with your GitHub account (`jasonyi33`).
3. If this is your first time, Vercel will ask to install its GitHub app. Grant access to **only the `personalwebsite` repo** (least-privilege) or all repos if you prefer.
4. On the import screen, find `jasonyi33/personalwebsite` and click **Import**.

### 2. Configure the project

Vercel auto-detects Next.js. You shouldn't need to change anything in **Build & Output Settings** — leave them all on the defaults:

- Framework Preset: **Next.js**
- Build Command: *(default)* — Vercel will use `npm run build`, which already runs `contentlayer2 build && next build` because of how `package.json` is set up.
- Output Directory: *(default)*
- Install Command: *(default)*
- Root Directory: *(leave blank — repo root)*

### 3. Set environment variables

Click **Environment Variables** on the import screen and add this one:

| Name | Value | Environments |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://jasonyi.live` | Production, Preview, Development |

This populates the canonical URL used by `lib/seo.ts` (sitemap, RSS, OG images). Skip this and the site still works, but sitemap URLs will point at the default fallback.

### 4. Deploy

Click **Deploy**. First build takes ~2 minutes. When it finishes you'll get a `*.vercel.app` URL — open it and confirm the boot sequence plays and the desktop loads.

---

## Part 2 — Add `jasonyi.live` to the Vercel project

### 1. Add the domain in Vercel

1. In the Vercel project, go to **Settings → Domains**.
2. Click **Add**.
3. Type `jasonyi.live` and click **Add**.
4. Vercel will ask whether to redirect the apex (`jasonyi.live`) to `www.jasonyi.live` or vice versa. **Recommended: keep `jasonyi.live` as primary, redirect `www` → apex.** Click **Add** again for the `www` variant if Vercel prompts you.
5. Vercel will show DNS records you need to set. Keep this tab open.

Vercel will display **one of two paths** depending on what you choose:

- **Option A (Recommended): Use Vercel's nameservers.** Easiest. Vercel handles all DNS for the domain.
- **Option B: Keep Namecheap nameservers, just add records.** You stay in control of DNS at Namecheap — useful if you have other subdomains pointed elsewhere (mail, etc.). Since this is a fresh domain with nothing else, Option A is simpler.

Both options are covered below — **pick one**.

---

### Option A — Switch nameservers to Vercel (simplest)

In Vercel's domain panel, copy the **Vercel nameservers**. They look like:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Then in Namecheap:

1. Sign in at <https://www.namecheap.com>.
2. Go to **Dashboard → Domain List**.
3. Find `jasonyi.live` and click **Manage**.
4. In the **Nameservers** dropdown, select **Custom DNS**.
5. Paste the two Vercel nameservers from above.
6. Click the green check ✓ to save.

Done. DNS propagation typically takes **10 minutes to 2 hours**. Vercel auto-provisions an SSL cert via Let's Encrypt once it sees the nameservers — no action needed on your end.

---

### Option B — Keep Namecheap nameservers, add A + CNAME records

Vercel's domain panel will show you exactly which records to add. They'll look like:

| Type | Host | Value |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

In Namecheap:

1. Sign in → **Domain List** → **Manage** next to `jasonyi.live`.
2. Click the **Advanced DNS** tab.
3. **Delete** any existing default records that conflict (Namecheap puts a parking-page A record by default — remove it).
4. Click **Add New Record** and add:
   - Type: `A Record`, Host: `@`, Value: `76.76.21.21`, TTL: `Automatic`
   - Type: `CNAME Record`, Host: `www`, Value: `cname.vercel-dns.com.` *(trailing dot is fine if Namecheap adds it; doesn't matter if not)*, TTL: `Automatic`
5. Save.

Propagation: typically 10 minutes to a few hours. Vercel will provision SSL automatically once DNS resolves.

---

## Part 3 — Verify

Once Vercel's domain panel shows green checkmarks next to `jasonyi.live` and `www.jasonyi.live`:

1. Open <https://jasonyi.live> in a fresh tab — should show the boot sequence.
2. Open <https://www.jasonyi.live> — should redirect to the apex.
3. Try a deep link: <https://jasonyi.live/projects/voicereach> — should open the desktop with the Projects window focused on VoiceReach.
4. Test the API: <https://jasonyi.live/api/now> — should return `{"commit":...}` (real commit since `now.mdx` has `githubUser: jasonyi33`).
5. Check OG card: paste `https://jasonyi.live` into <https://www.opengraph.xyz> or <https://cards-dev.twitter.com/validator> — should show the cyan-on-navy JASON-OS card with your name.

---

## Continuous deployment

After this initial setup:

- **Every push to `main`** triggers a production deploy to `jasonyi.live`.
- **Every push to any other branch** (or PR) gets its own preview URL like `personalwebsite-git-feature-x-jasonyi33.vercel.app`.
- You can roll back instantly from **Deployments → ⋯ → Promote to Production** if anything breaks.

---

## Things to do later (optional)

- **Add a real avatar**: drop a 400×400 image into `public/jason.jpg` and update `content/about.mdx` frontmatter to add `avatar: "/jason.jpg"` — the AboutApp will swap the ASCII silhouette for it.
- **Add blog posts**: drop MDX files into `content/blog/` with frontmatter (see existing `boot-log-001.mdx` for the schema). They show up in the LOGS app and `/rss.xml` automatically on next build.
- **Spotify / Last.fm "currently listening"**: requires a Last.fm API token. Add `LASTFM_API_KEY` + `LASTFM_USER` env vars in Vercel, then ping me to wire the `lib/github.ts` pattern for Last.fm.
- **Custom 404 message**: edit `app/not-found.tsx`.
- **Switch chat persona to live AI replies**: requires `ANTHROPIC_API_KEY` (or any provider) env var in Vercel and ~30 lines of additional wiring in `lib/personality.ts` and `components/apps/terminal/TerminalChat.tsx`.

---

## Troubleshooting

- **"Domain not configured"** in Vercel after switching nameservers → wait. DNS can take 2+ hours in rare cases. Check propagation at <https://www.whatsmydns.net>.
- **Mixed-content warning** → make sure all asset URLs use `https://` or relative paths. Should be fine out of the box.
- **Build fails on Vercel but works locally** → check the Vercel build log. Most common cause is missing env var; if it's a contentlayer error, make sure the build script in `package.json` still has `contentlayer2 build && next build`.
- **Boot screen plays every visit** → that's a localStorage quirk on some browsers. Add `?skip-boot=1` to bypass; the site sets the flag on first successful boot.
