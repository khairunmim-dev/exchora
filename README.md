# EXCHORA — Share Knowledge. Exchange Opportunities.

EXCHORA is a web platform where students exchange study materials with each other — notes, books, slides, question banks, lab reports and tutorials. Instead of buying or searching group chats, a student posts what they **HAVE** and what they **WANT**, and EXCHORA matches them with other students so both sides benefit.

**Live demo:** _coming soon_

## Features

- **Exchange posts** — post a HAVE ⇄ WANT pair with subject, semester and resource type (Notes, Books, Slides, Question Banks, Lab Reports, Tutorials, Other)
- **Search & filters** — live search plus filters by subject, semester and type
- **Smart Matching** — a rule-based engine that pairs your HAVE with other students' WANT (and the other way round)
- **Accounts & profiles** — email/password and Google sign-in, editable profile (university, department, semester, bio) and profile photos
- **Exchange Requests** — request an exchange on any post; the poster accepts or rejects; **contact numbers stay private and are revealed to both sides only after acceptance**; both sides confirm to mark the exchange Completed
- **Ratings & reputation** — after a completed exchange, both sides rate each other (1–5★); average ratings show on post cards and profiles
- **StudyBot** — a built-in rule-based guide that explains how everything works, answers common questions, finds posts and checks your matches (English & বাংলা)
- **Admin dashboard** — the site owner can view platform stats and moderate posts
- **Bilingual UI** — full English / বাংলা toggle, plus dark & light mode

## Tech stack

- HTML, CSS and vanilla JavaScript (single-page app with view switching)
- Firebase Authentication (email/password + Google)
- Cloud Firestore (posts, users, exchange requests, ratings) with security rules that enforce ownership and contact privacy
- No build step — plain static files, deployable to any static host (Vercel, GitHub Pages, Netlify)

## Run locally

1. Clone the repository.
2. Open the folder in VS Code and start **Live Server**.
3. Open the site as `http://localhost:5500` (Firebase sign-in requires `localhost`, not `127.0.0.1`).

Without Firebase reachable, the site falls back to a local demo mode stored in the browser.

## Project structure

```
index.html   — page structure (all views)
style.css    — Navy + Gold theme, dark/light mode, responsive layout
script.js    — app logic: posts, auth, matching, requests, ratings, StudyBot, admin
```

## Author

**Khairun Nessa Mim** — CSE student, Southeast University, Dhaka, Bangladesh.
