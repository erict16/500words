# 500 Words

Private daily writing. Five hundred words. Same bones as [750 Words](https://750words.com): a month of boxes, a strike when you finish, confetti, badges, a bowling-style score, a free one-month challenge. No AI. No marketing homepage. Free.

Live: [500words.vercel.app](https://500words.vercel.app)

## What you get

- A blank page and a word count
- Month grid: empty, a dot if you started, `/` spare (100+ words), `X` strike (500)
- Points like bowling (spare adds yesterday, strike adds two days, turkey is 6)
- Confetti at 500
- Font, size, spacing, light/dark
- Autosave, Google sign-in, writing stays in your Firebase account
- Time and break stats (not “what your words mean”)
- Animal badges, one-month challenge, public score page (never the writing)
- Miss yesterday? Write 1000 today to keep the streak

## Setup

1. Create a Firebase project (Auth → Google, Firestore).
2. Copy `.env.example` to `.env.local` and fill the `NEXT_PUBLIC_FIREBASE_*` keys.
3. Deploy `firestore.rules`.
4. Add `localhost` and `500words.vercel.app` under Auth → authorized domains.

```bash
npm install
npm run dev
```

## Stack

Next.js, Tailwind CSS, Firebase Auth + Firestore, Vercel.
