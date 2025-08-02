# Deepcover Game



[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/neel-s-projects-9464065f/v0-undercover-game)

# Deepcover 🎯

**A fast‑paced social deduction party game for **_4–8 players_**, where everyone is **anonymous** and the pressure is on.**  
*(As shown on the main landing page: “Social Party Game · 4‑8 Players · Anonymous · Fast‑Paced”)†

---

## ℹ️ Description

Deepcover is a free-to-play *browser-based* multiplayer game for groups of **4–8** people. One player is a `Spy` (we call him the Echo/Blank) with a hidden mission; everyone else tries to expose them using quick inference and clever deception. Games are **anonymous, real-time**, and designed to be completed in under **10 minutes**.

You can think of it as **@play.social.meets.Undercover**, where every round forces players to bluff or sniff out the bluff.

---

## 🚀 Live Demo

Play instantly on the public demo:  
**https://deepcover.vercel.app/**

---

## 👑 Features

- **4–8 players**, no sign‑ups required.  
- **Anonymous lobby**: only you know your display name.  
- **Fast-paced rounds**: each round lasts 60 seconds or until mission ends.  
- **Real-time voting and elimination**: data-driven decision-making.  
- **Minimal UI**: mobile-first and distraction-free.

---

## 🎮 How to Play (Online Mode is under construction although you can play offline with your friends on 1 device!)

TLDR for Online Mode
1. One player **creates a room** and shares the link or room code.  
2. Others **join** anonymously — no account, no email.  
3. **Each round**:
   - A random player is assigned the secret **Spy** role.
   - Non‑spy players try to expose the Spy using brief hints.
   - After a public timer, everyone **votes** to eliminate a suspect.
4. **Scoring**:
   - *Spy survives*: Spy wins.
   - *Spy eliminated*: Non‑spy team wins.
   - Optionally support scoring across rounds, e.g. **best of 3**.

> **Host control**: Next.js-based UI with React and WebSockets (Socket.IO or Pusher).  
> All state is locked per‑room, per‑round on the server.

---

## 🛠️ Tech Stack

| Layer           | Tech Stack               | Notes                        |
|------------------|--------------------------|-------------------------------|
| **Frontend/UI**  | React + Next.js         | Client‑side rendering        |
| **Backend**      | Vercel API Routes        | Per-room state via in-memory store (or Redis) |
| **Real-time**    | WebSocket (Socket.IO or Pusher Channels) | Live lobby updates & voting |
| **Styling**      | Tailwind CSS or plain CSS | Mobile‑first responsive design |

*(Optional alternative: Firebase Realtime DB instead of serverless state).*

---

## 💻 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/deepcover.git
cd deepcover

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
# Visit: http://localhost:3000

# 4. Build for production
npm run build

# 5. Start the production server
npm start
