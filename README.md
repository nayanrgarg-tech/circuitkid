# CircuitKid

A video-lesson robotics and electronics course site for kids and total beginners — built with Next.js, exported as plain static files, and hosted free on GitHub Pages.

This README is written for future-you, on a day when you have not touched this project in six months. Every routine task is spelled out in full.

---

## 1. Quick start

You need [Node.js](https://nodejs.org) 20 or newer. Check with `node -v`.

```bash
npm install     # once, after cloning (or after someone changes package.json)
npm run dev     # local preview at http://localhost:3111
npm run build   # produces the finished site in ./out
```

While `npm run dev` is running, save any file and the browser updates itself. Stop it with `Ctrl+C`.

Other useful scripts:

```bash
npm run typecheck   # catches TypeScript mistakes without building
npm run start       # serves the already-built ./out folder, exactly as visitors see it
```

`npm run build` writes a folder of ordinary HTML, CSS, JS and images into `./out`. There is no server involved — that folder *is* the website. `./out` is gitignored; the GitHub Action rebuilds it on every deploy.

---

## 2. Adding a lesson video

This is the task you will do most often. All lesson content lives in one file: **`src/data/curriculum.ts`**.

1. Open `src/data/curriculum.ts`.
2. Find the lesson by its title (use your editor's find, `Cmd+F`).
3. Set its `video` field.

Every lesson looks like this:

```ts
{
  slug: "2-1-led-blink",
  id: "2.1",
  title: "LED Blink",
  blurb: "The classic first program. Make a light blink…",
  video: "https://www.youtube.com/embed/mWavIuNxlNs",   // <-- this line
  materials: ["Arduino UNO R4", "Breadboard", "LED", "220 ohm resistor"],
  learn: ["setup() and loop()", "digitalWrite() and delay()"],
  resources: [
    { kind: "code",   label: "Code",   url: "https://docs.google.com/presentation/d/…/edit",
      embed: "https://docs.google.com/presentation/d/…/embed?start=false&loop=false&rm=minimal" },
  ],
},
```

Most lessons already have a real video — they were imported from the exported
Google Site, so you should rarely need to add one from scratch.

The `video` field wants a YouTube **embed** URL:

```
https://www.youtube.com/embed/VIDEO_ID
```

### Finding the VIDEO_ID

All three kinds of YouTube link contain the same ID. Grab the part shown in bold below:

| Where you copied it from | Looks like                                     | VIDEO_ID      |
| ------------------------ | ---------------------------------------------- | ------------- |
| Address bar (watch page) | `https://youtube.com/watch?v=`**`dQw4w9WgXcQ`**| `dQw4w9WgXcQ` |
| The **Share** button     | `https://youtu.be/`**`dQw4w9WgXcQ`**           | `dQw4w9WgXcQ` |
| A Short                  | `https://youtube.com/shorts/`**`dQw4w9WgXcQ`** | `dQw4w9WgXcQ` |

On a watch link, stop at the `&` if there is one — `?v=dQw4w9WgXcQ&t=42s` still has the ID `dQw4w9WgXcQ`.

### When a lesson has no video

Leaving `video: ""` is fine. The lesson page shows a "not filmed yet" card instead of an
empty hole. Two lessons deliberately have no video — the Button Challenge and the Inventor
Challenge are slide-based challenges, and their slides are embedded instead.

---

### Slides, code and wiring (the `resources` list)

Each resource is:

```ts
{ kind: "slides" | "code" | "wiring" | "form" | "download",
  label: "Code",
  url:   "…the normal Google link…",
  embed: "…the iframe link, or null…" }
```

`url` is where the "Open in Google ↗" button goes. `embed` is what gets shown **inline**
on the lesson page. Set `embed: null` and it renders as a plain link instead.

Building the `embed` link:

| Type            | Take the normal link and…                                          |
| --------------- | ------------------------------------------------------------------ |
| Google Slides   | replace `/edit?…` with `/embed?start=false&loop=false&rm=minimal`   |
| Google Docs     | replace `/edit?…` with `/preview`                                   |
| Google Sheets   | replace `/edit?…` with `/preview`                                   |

To open a deck on a particular slide, append `&slide=id.gXXXXXXXX` — that id is the
`slide=` value already sitting in the normal link.

> **The one thing that will bite you:** anything you embed has to be shared
> **"Anyone with the link — Viewer"** in Google. If it is restricted, students see a Google
> sign-in box inside the frame instead of your content. Check it in a private window.

## 3. Issuing student logins

Each student gets one access code. Codes look like `4KJ7-M2QP-XR9T` — no letter `O`, no digit `0`, no `1`/`I`/`L`, so they can be read aloud over the phone without confusion.

```bash
npm run issue-login -- "Ava Patel"          # one student, prints the code once
npm run issue-login -- "Ava" "Ben" "Cleo"   # several at once
npm run issue-login -- --blank 5            # 5 unassigned codes for a class
npm run issue-login -- --list               # who currently has a login
npm run issue-login -- --revoke ava-patel   # remove one (use the id from --list)
```

The `--` after the script name is required. It tells npm "everything after this belongs to the script, not to npm."

*(If `npm run issue-login` is ever missing from `package.json`, the same tool runs directly: `node scripts/issue-login.mjs -- "Ava Patel"`.)*

### Things to know before you hand a code out

- **The roster file is safe to commit.** `src/data/roster.json` stores only a SHA-256 *hash* of each code, plus the student's name, id and issue date. Reading the file does not reveal anybody's code.
- **A code is displayed once and cannot be recovered.** That is a consequence of storing only hashes. If a student loses their code, you do not look it up — you revoke and re-issue:
  ```bash
  npm run issue-login -- --revoke ava-patel
  npm run issue-login -- "Ava Patel"
  ```
  Note this gives them a fresh `id`, so their old saved progress will not follow them automatically. Have them export a transfer code first if they still have access on any device (see §5).
- **Nothing is live until you deploy.** Issuing a login edits a file on your computer. Commit and push it, and the GitHub Action rebuilds the site with the new roster baked in. Until then the new code will not work on circuitkid.com.
  ```bash
  git add src/data/roster.json
  git commit -m "Issue login for Ava Patel"
  git push
  ```
- **Revoke the demo login before launch.** The repo ships with a seeded `demo` student so you can test the sign-in flow without issuing a real code. Remove it before you invite anyone:
  ```bash
  npm run issue-login -- --revoke demo
  ```

---

## 4. How progress tracking works

When a signed-in student marks a lesson complete, that gets saved in **their browser's `localStorage`**, on **the device they are using**, keyed to their student id. Nothing is sent anywhere — there is no database and no server in this project.

The dashboard shows two things: the **next lesson** they haven't done, and a list of
**every lesson they've finished**, grouped by unit. There is no time tracking anywhere in
the app — no durations, no hours logged.

What that means in practice:

- Progress is private to that student on that browser.
- Progress on the iPad and progress on the laptop are two separate lists.
- Clearing browser data, or using a private/incognito window, loses it.

To move progress between devices, the dashboard produces a **transfer code**: a long string the student copies from the old device and pastes into "import" on the new one. Importing *merges* — it adds completed lessons rather than overwriting, so it is safe to run in either direction.

---

## 5. Security: what the login does and does not do

Be honest with yourself about this, because it is easy to assume more protection than exists.

A static site works by sending **all** of its HTML and JavaScript to **every** visitor. There is no server deciding who may see what. So the access code:

**What it does**

- Gives each student an identity and their own progress tracking.
- Keeps the lesson area tidy and personal — you arrive, type your code, and see your dashboard.
- Stops casual wandering: someone without a code has no obvious way in.

**What it does not do**

- It does **not** cryptographically protect lesson content. Someone technical who wants to read lesson text without a code can, by looking at the files the site already sent them.
- It is **not** a password. Codes are not secret credentials tied to an email; they are shareable strings.
- The roster (names + hashes) ships with the site, so student names are technically discoverable by anyone who digs.

For a robotics course this is the right trade-off — the content is meant to be taught, not guarded, and the cost of the alternative (a real backend) is not worth it yet. But the rule is firm: **do not put anything genuinely private behind this gate.** No addresses, no payment details, no medical or school records, no unpublished material you would be upset to see leak.

---

## 6. Upgrading to real accounts (optional)

If you later want real email + password accounts, and progress that syncs across devices automatically with no transfer codes, you do not need to rewrite the site. The whole storage layer is deliberately kept behind one seam:

**`src/lib/student.tsx`** — three things in that file are the only code that touches storage:

| Function          | Today                                            | After the upgrade                    |
| ----------------- | ------------------------------------------------ | ------------------------------------ |
| `signIn(code)`    | hashes the code, compares against `roster.json`  | calls the auth service's sign-in     |
| `readProgress(id)`| reads `localStorage`                             | fetches this student's row           |
| `writeProgress()` | writes `localStorage`                            | saves this student's row             |

Swap those three for calls to a hosted auth + database service and everything else — every page, the dashboard, the progress bars, `useStudent()`, `useProgressStats()` — keeps working unchanged, because they only ever talk to this file.

[Supabase](https://supabase.com) is the natural fit: it has a generous free tier, real email/password auth, and a REST API you can call with plain `fetch()` from a static page, so it adds **zero** npm dependencies and the site can stay a static export on GitHub Pages. (Firebase or Clerk would work too.) The public "anon" key is designed to be shipped in client code; the actual protection comes from row-level security rules configured on the service, not from hiding the key.

Keep `readProgress`/`writeProgress` as a local cache even after the upgrade — it makes the dashboard feel instant and keeps working offline.

---

## 7. Deploying to GitHub Pages

**Push to `main`. That's the whole deploy.**

```bash
git add -A
git commit -m "What changed"
git push
```

`.github/workflows/deploy.yml` then runs `npm ci` and `npm run build` on GitHub's servers and publishes the resulting `./out` folder to GitHub Pages. Watch it happen in the repo's **Actions** tab; a green check means it is live, usually in two or three minutes.

One-time setup, if Pages has never been enabled: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Custom domain — circuitkid.com

`public/CNAME` already contains `circuitkid.com`, and everything in `public/` is copied to the root of the built site, so GitHub sees the custom domain on every deploy.

What is left is DNS, at whoever sells you the domain:

- Four `A` records for the apex `circuitkid.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- One `CNAME` for `www` → `<your-github-username>.github.io`

Then in **Settings → Pages** enter the custom domain and tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

With a custom domain, the site lives at the root of the host, so **leave `NEXT_PUBLIC_BASE_PATH` unset**.

### The other option — USER.github.io/REPO

If you skip the custom domain and serve from a project page instead, every URL is nested under `/REPO`, and Next has to know that to write correct links and asset paths. Set it on the build step in `.github/workflows/deploy.yml` — there is a commented-out block sitting right there:

```yaml
      - name: Build (writes ./out)
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /REPO_NAME
```

Locally, the equivalent is `NEXT_PUBLIC_BASE_PATH=/REPO_NAME npm run build`. Symptom of getting this wrong: the page loads but with no styling and broken images — the browser is asking for `/_next/...` when the files are at `/REPO/_next/...`.

Because of `basePath`, always use `next/image` for images and `next/link` for internal links; both add the prefix automatically. A bare `<img src="/images/...">` will not.

### Why public/.nojekyll matters

GitHub Pages historically ran everything through Jekyll, which **ignores folders whose names start with an underscore** — which would silently delete Next's entire `_next/` folder, i.e. all the CSS and JS. The empty `public/.nojekyll` file turns Jekyll off. Do not delete it.

---

## 8. Project structure

```
CircuitKid/
├─ src/
│  ├─ app/                  # every URL is a folder here (App Router)
│  │  ├─ layout.tsx         # <html>, fonts, nav, footer — wraps every page
│  │  ├─ globals.css        # Tailwind v4 setup + the colour/animation tokens
│  │  ├─ page.tsx           # /
│  │  ├─ curriculum/        # /curriculum   (unit anchors: #unit-0 … #extras)
│  │  ├─ lessons/[slug]/    # /lessons/1-3-first-blink  (one page per lesson)
│  │  ├─ kit/  about/  contact/
│  │  ├─ login/  dashboard/ # student sign-in + progress
│  │  └─ not-found.tsx      # the 404 page
│  ├─ components/           # reusable UI: ui.tsx, Nav, Footer, VideoEmbed,
│  │                        #   Progress, StatCounter
│  ├─ data/                 # ← almost all your edits happen in here
│  │  ├─ curriculum.ts      #   units, lessons, videos, capstones
│  │  ├─ site.ts            #   name, tagline, email, phone, links, photos
│  │  └─ roster.json        #   student logins (hashes only) — do not hand-edit
│  └─ lib/
│     ├─ student.tsx        #   sign-in + progress (the upgrade seam, §6)
│     └─ types.ts           #   the shapes: Lesson, Unit, Capstone, Resource
├─ scripts/
│  ├─ issue-login.mjs       # npm run issue-login
│  └─ lib.mjs               # code generation + hashing
├─ public/                  # copied verbatim to the site root
│  ├─ images/kit/           #   real kit photos
│  ├─ images/projects/      #   student project screenshots
│  ├─ favicon.svg
│  ├─ CNAME                 #   circuitkid.com
│  └─ .nojekyll             #   keeps _next/ alive — do not delete
├─ .github/workflows/deploy.yml
└─ next.config.mjs          # output:'export', trailingSlash, basePath
```

Rule of thumb: **content changes live in `src/data/`, design changes live in `src/components/` and `src/app/`.**

Note that `src/app/lessons/[slug]/` is a dynamic route. Because the site is a static export, it generates one folder per lesson at build time from `allLessons`. Add a lesson to `curriculum.ts` and its page appears on the next build automatically — no new file needed.

---

## 9. Things left to fill in

- [ ] **Projects C, D and E have no lessons yet.** Laser Harp, Crack the Vault and Sentry
      Turret show up on the site as "still filming". To add one, append lessons to `unit5`
      in `curriculum.ts` with `project: "C"` (or `"D"` / `"E"`) and bump that capstone's
      `lessonCount`.
- [ ] **Two lessons have no video on purpose.** The Button Challenge (1.7) and the Inventor
      Challenge (1.9) are slide-based. Nothing to fix unless you film them.
- [ ] **Social links are empty.** `links.youtube`, `links.instagram` and `links.tiktok` in
      `src/data/site.ts` are `''`, so the footer shows them as "soon". Fill them in or
      delete the rows.
- [ ] **Revoke the demo login before launch:** `npm run issue-login -- --revoke demo`
- [ ] **Check your embedded decks are publicly shared** (see §2). An embed that is not
      shared shows a Google sign-in box to every student.
