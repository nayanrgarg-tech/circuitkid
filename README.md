# CircuitKid

A video-lesson robotics and electronics course site for kids and total beginners — built with Next.js, exported as plain static files, and hosted free on GitHub Pages.

This README is written for future-you, on a day when you have not touched this project in six months. Every routine task is spelled out in full.

---

## 1. Quick start

```bash
npm install
npm run dev        # preview at http://localhost:3111
```

### Does any of this push to GitHub?

**No — except `npm run publish`.** Everything else only changes files on your own
machine. `add-lesson`, `issue-login` and `seal` are all local. Nothing reaches the
live site until you run:

```bash
npm run publish
npm run publish -- "added the laser harp lessons"
```

That seals the course, commits everything, pushes, and GitHub rebuilds the site in
about a minute. It refuses to run if a secret file would be committed.

| Command | What it does | Publishes? |
| --- | --- | --- |
| `npm run dev` | preview locally | no |
| `npm run add-lesson` | add a lesson, answering prompts | no |
| `npm run issue-login -- "Ava"` | create a student login | no |
| `npm run announce -- "…"` | post an announcement | no |
| `npm run link-form -- "…"` | send progress to your Google Form | no |
| `npm run seal` | rebuild the course files | no |
| `npm run unseal` | restore `content/course.json` | no |
| `npm run publish` | seal, commit, push | **yes** |

---

## 2. Adding and editing lessons

**Everything lives in one file: `content/course.json`.** Edit it, then run:

```bash
npm run seal
```

Or skip the JSON entirely and let it ask you questions:

```bash
npm run add-lesson
```

That prompts for the unit, title, description, YouTube link and any Slides/Docs
links, works out the embed URLs for you, adds the lesson and seals it.

### Why there are two files

`content/course.json` is **gitignored**, because the repo is public and your lesson
videos are unlisted — the URL is the secret. `npm run seal` splits it in two:

| File | Contains | Committed? |
| --- | --- | --- |
| `src/data/curriculum.ts` | unit and lesson titles, descriptions | yes, public |
| `public/course.enc.json` | video URLs, slides, code, wiring, materials | yes, encrypted |

So the outline is readable by anyone (good for Google), and the actual course is not.

> **Never edit `src/data/curriculum.ts` by hand.** `npm run seal` overwrites it.

### Lost content/course.json?

```bash
npm run unseal
```

rebuilds it from the encrypted file. This only needs `.course-key`, so **back that
file up** — it is the one thing that cannot be recovered.

### Links you can paste

Any YouTube form works — `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/shorts/ID`.
For Google, paste the normal share link; `add-lesson` converts it:

| Type | Becomes |
| --- | --- |
| Slides | `/embed?start=false&loop=false&rm=minimal` |
| Docs / Sheets | `/preview` |

> Anything embedded must be shared **"Anyone with the link — Viewer"** in Google, or
> students see a sign-in box instead of your content.

---

## 3. Issuing student logins

```bash
npm run issue-login -- "Ava Patel"
```

Prints a random code like `J6TP-KAEZ-J7AW`. **Random codes are shown once and cannot
be looked up again** — only a hash and an encrypted key go into `roster.json`.

### Codes you choose (recommended)

```bash
npm run issue-login -- "Ava Patel" --code AVA-ROBOT-2026
```

Pick the code yourself and it never changes on you. If a student loses it, revoke and
re-issue the *same* code. Punctuation and case are ignored, so `AVA-ROBOT-2026`,
`ava robot 2026` and `avarobot2026` are all the same code — students can type it
however they like.

Codes must be at least 8 letters or digits, and two students cannot share one.

### The rest

```bash
npm run issue-login -- "Ava" "Ben" "Cleo"     # several at once
npm run issue-login -- --blank 5              # 5 unassigned codes for a class
npm run logins                                # who has a login (and their id)
npm run issue-login -- --revoke ava-patel     # remove one, by id from the list
```

Revoking deletes that student's wrapped key, so their code stops opening the course.
Everyone else keeps working.

> **Issuing a login does not publish it.** Run `npm run publish` afterwards (§1).

---

## 4. Announcements and progress

### Posting an announcement

```bash
npm run announce -- "New Project C lessons are up"
npm run announce -- "No class Saturday" "Back to the usual time next week."
npm run announce -- --list
npm run announce -- --pin 2026-08-29-new-project-c     # keep it at the top
npm run announce -- --remove 2026-08-29-new-project-c
```

The newest one shows as a bar on the home page (students can dismiss it, and it stays
dismissed until you post a newer one). All of them are listed on the dashboard.

Announcements are **public** — anyone can read them. Don't put access codes in one.
As with everything else, run `npm run publish` to put it live.

### How progress tracking works

When a signed-in student marks a lesson complete, it saves to **their browser's
localStorage**, on **the device they are using**, keyed to their student id. There is no
database and no server.

- Progress is private to that student on that browser.
- The iPad and the laptop keep two separate lists.
- Clearing browser data, or an incognito window, loses it.
- Signed-out visitors have nothing to track — the "mark complete" button asks them to
  sign in first.

The dashboard shows the next lesson they haven't done and everything they have finished,
grouped by unit. No time tracking, and no course-size totals anywhere.

To move progress between devices, the dashboard makes a **transfer code**: a long string
they copy from the old device and paste into "import" on the new one. Importing *merges*,
so it is safe to run in either direction.

---

## 5. Seeing how your students are doing

Progress lives in each student's own browser, so it needs somewhere to go. The site posts a
row to a Google Form, which lands in a Sheet you own. No accounts, no cost, nothing to keep
alive. **This is off until you set it up**, and the site works fine without it.

### One-time setup (about two minutes)

1. Make a new Google Form. Add **five short-answer questions**. The titles only need to
   *contain* these words:

   | Question title | What lands in it |
   | --- | --- |
   | Student | who it is |
   | Lesson | which lesson |
   | Status | `done`, `opened` or `unmarked` |
   | Minutes | active minutes on that lesson |
   | Total | their running total |

2. Link it. Paste the form's normal link:

   ```bash
   npm run link-form -- "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform"
   ```

   That reads the form and works out Google's internal field ids itself. You never see them.

3. `npm run publish`

In the Form, hit **Responses → Link to Sheets** once, and rows start arriving.

To switch it off again: `npm run link-form -- --off`

### Reading it

Two options. The Sheet itself is perfectly usable — sort by Student or Total.

For something nicer, open **/admin** on the site. Paste the Sheet's CSV (File → Download →
CSV, or just copy the cells) and it turns the raw rows into a card per student: lessons
completed, total active time, when they were last on, and a per-unit breakdown. If you
publish the Sheet to the web as CSV you can paste that URL once instead and it loads itself.

### What gets sent, and what doesn't

Sent: the student's name, the lesson, whether it is done, and minutes.
Never sent: their access code, the course key, or any lesson content.

A row goes out when a student ticks a lesson off, and when they leave a lesson they spent
more than a minute on. If they are offline it queues and retries later.

**Time is measured as *active* time.** The clock stops when the tab is hidden, the window
loses focus, or there has been no input for a minute — so a laptop left open overnight will
not report eight hours. It is capped at four hours per lesson as a backstop.

Two honest limits:

- **/admin is not private.** Anything on a static site is public. The URL is unlisted, but
  the page holds no data of its own — nothing appears until you paste it in. Don't treat it
  as a locked door.
- **A determined student could send fake rows**, since the posting happens in their browser.
  Fine for seeing who is keeping up; not something to grade on.

---

## 6. What the login actually protects

The lesson content is **encrypted**, not just hidden.

- One random course key encrypts every lesson's video, slides, code, wiring and
  materials into `public/course.enc.json`.
- Each access code carries its own wrapped copy of that key. Signing in stretches
  the code with PBKDF2 (250,000 rounds), unwraps the key, and decrypts the course
  in the browser.
- Without a valid code the content is ciphertext. It is not in the page HTML and
  not in the JavaScript bundle.
- Revoking a login deletes its wrapped key, so that code stops working. Everyone
  else's keeps working — no re-encrypting.

What is deliberately **public**: unit and lesson titles and their one-line
descriptions. That is the shop window, and it is what search engines index.

One honest caveat: a signed-in student can read the decrypted URLs in their own
browser and pass them on. No web design prevents that. What this stops is the
course being readable by anyone who simply finds the site.

---

## 7. Upgrading to real accounts (optional)

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

## 8. Deploying to GitHub Pages

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

## 9. Project structure

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

## 10. Things left to fill in

- [ ] **Projects C, D and E have no lessons yet.** Laser Harp, Crack the Vault and Sentry
      Turret show up on the site as "still filming". To add one, append lessons to `unit5`
      in `curriculum.ts` with `project: "C"` (or `"D"` / `"E"`) and bump that capstone's
      `lessonCount`.
- [ ] **Two lessons have no video on purpose.** The Button Challenge (1.7) and the Inventor
      Challenge (1.9) are slide-based. Nothing to fix unless you film them.
- [ ] **Social links are empty.** `links.youtube`, `links.instagram` and `links.tiktok` in
      `src/data/site.ts` are `''`, so the footer shows them as "soon". Fill them in or
      delete the rows.
- [ ] **Revoke the demo login before launch:** `npm run issue-login -- --revoke demo-student`
- [ ] **Check your embedded decks are publicly shared** (see §2). An embed that is not
      shared shows a Google sign-in box to every student.
