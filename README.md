# EXCHORA — Share Knowledge. Exchange Opportunities.

A web platform where students exchange study materials with each other —
notes, books, slides, question banks, lab reports and tutorials. Instead of
buying materials or hunting through group chats, a student posts what they
**HAVE** and what they **WANT**, and EXCHORA matches them with other students
so both sides benefit.

## Live site

🌐 [exchora-eta.vercel.app](https://exchora-eta.vercel.app/)

## Features

- **Exchange posts** — post a HAVE ⇄ WANT pair with subject, semester and resource type (Notes, Books, Slides, Question Banks, Lab Reports, Tutorials, Other)
- **Search & filters** — live search plus filters by semester and material type
- **Smart Matching** — a rule-based engine that pairs your HAVE with other students' WANT (and the other way round)
- **Accounts & profiles** — email/password and Google sign-in, editable profile (university, department, semester, bio) and profile photos
- **Exchange Requests** — request an exchange on any post and say what you will give in return; the poster accepts or rejects; **contact numbers stay private and are revealed to both sides only after acceptance**; both sides confirm to mark the exchange Completed
- **File links on posts** — attach a Google Drive link to a post; everyone can see the post has a file, but the link stays hidden until the poster accepts your exchange request — or you unlock it with points
- **Points system** — earn and spend points (see below) while exchanges themselves stay completely free
- **Ratings & reputation** — after a completed exchange, both sides rate each other (1–5★); average ratings show on post cards and profiles
- **StudyBot** — a built-in rule-based guide that explains how everything works, answers common questions, finds posts and checks your matches (English & বাংলা)
- **Admin dashboard** — the site owner can view platform stats and moderate posts
- **Sidebar navigation** — fixed sidebar on desktop, slide-in drawer on mobile, with your profile and live points balance
- **Community wall** — a public space where all students post and discuss together
- **Private messages** — 1-to-1 chats with any student, with unread badges
- **Claimable rewards** — points from exchanges, ratings and file unlocks wait in your profile until you claim them; spending always asks first
- **Bilingual UI** — full English / বাংলা toggle, plus dark & light mode

## Points system

- 🎁 **50 points free** when you create an account
- 📝 **+5 points** for every post you publish
- 🤝 **+10 points** when an exchange is completed (both sides earn)
- 📎 **+15 points** when someone unlocks your file with points
- ⭐ **+5 points** when you receive a 5-star rating
- 🔓 **15 points** to unlock a file instantly, without an exchange (paid to the poster; the file then stays open for you forever)
- 📌 **20 points** to pin your post at the top of the list for 3 days (Featured)

## Built with

- HTML5
- CSS3
- JavaScript (vanilla, no frameworks — single-page app with view switching)
- Firebase Authentication (email/password + Google)
- Cloud Firestore (posts, users, requests, ratings, points, unlocks) with security rules that enforce ownership and privacy

## Project structure

```
├── index.html              ← page structure (all views)
├── style.css               ← Navy + Gold theme, dark/light mode, responsive layout
├── script.js               ← app logic: posts, auth, matching, requests, points, ratings, StudyBot, admin
├── firestore-rules-v4.txt  ← the Firestore security rules used by the live site
└── README.md
```

## Run locally

1. Clone the repository.
2. Open the folder in VS Code and start **Live Server**.
3. Open the site as `http://localhost:5500` — Firebase sign-in requires `localhost`, not `127.0.0.1`.

Without Firebase reachable, the site falls back to a local demo mode stored in the browser.

## Author

**Mst. Khairun Nessa Mim**
- Portfolio: [khairunmim-dev.github.io](https://khairunmim-dev.github.io/)
- GitHub: [github.com/khairunmim-dev](https://github.com/khairunmim-dev)
- LinkedIn: [linkedin.com/in/mst-khairun-nessa-mim](https://www.linkedin.com/in/mst-khairun-nessa-mim/)
