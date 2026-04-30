# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built with Next.js 14 App Router, React, TypeScript, and Tailwind CSS. All persistence is local via `localStorage` — no backend, no external auth service.

---

## Live Demo

[https://habit-tracker-brown-rho.vercel.app/](https://habit-tracker-brown-rho.vercel.app/)

---

## Project Overview

Habit Tracker allows a user to sign up, log in, create daily habits, mark them complete, track streaks, and log out. The app is installable as a PWA and serves the app shell from cache when offline. This project is a direct implementation of the Stage 3 Technical Requirements Document — every route, utility, type, test ID, and test title follows the spec exactly.

---

## Setup

Requirements: Node.js 20 or higher, npm.

```bash
git clone <your-repo-url>
cd habit-tracker
npm install
```

Install Playwright browsers before running end-to-end tests:

```bash
npx playwright install chromium
```

---

## Running the App

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

For a production build:

```bash
npm run build
npm run start
```

---

## Running the Tests

Unit tests with coverage:

```bash
npm run test:unit
```

Integration and component tests:

```bash
npm run test:integration
```

End-to-end tests (the production server must be running on port 3000):

```bash
npm run build
npm run test:e2e
```

All suites in sequence:

```bash
npm test
```

The coverage report is written to `coverage/` after `test:unit` runs. Open `coverage/index.html` to browse line-by-line detail. The minimum threshold is 80% line coverage across `src/lib`.

---

## Assumptions and Trade-offs

Passwords are stored in plain text in `localStorage`. This is intentional given the spec requirement for local-only, deterministic persistence with no external auth service. In a production system, passwords would be hashed.

Email is normalized to lowercase on signup and login so that `User@example.com` and `user@example.com` are treated as the same address.

The app enforces password rules on signup (minimum 8 characters, one uppercase letter, one number) beyond what the TRD requires. These rules improve the product without breaking any required behavior or test contract.

The service worker uses a network-first strategy. If the network request fails, it falls back to the cache. This satisfies the offline shell requirement without over-caching dynamic behavior.

The `useSyncExternalStore` hook is used in `HabitList` to read from `localStorage` reactively. A custom `storage` event is dispatched after every write so that same-tab updates are picked up without a page reload. This pattern avoids the infinite re-render loop that a naive `useEffect` or `useState` approach would cause.

---

## Local Persistence Structure

All state is stored in `localStorage` under three fixed keys defined in `src/lib/constants.ts`.

`habit-tracker-users` stores a JSON array of user objects:

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "password": "Password1",
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
]
```

`habit-tracker-session` stores the active session or null:

```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

`habit-tracker-habits` stores a JSON array of habit objects:

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink Water",
    "description": "Stay hydrated",
    "frequency": "daily",
    "createdAt": "2026-04-27T10:00:00.000Z",
    "completions": ["2026-04-27", "2026-04-26"]
  }
]
```

The dashboard filters the full habits array by `userId` so each user only ever sees their own habits. Completions are stored as unique `YYYY-MM-DD` strings. Duplicates are rejected at the `toggleHabitCompletion` layer before the array is written back to storage.

---

## PWA Implementation

Four files implement PWA support:

`public/manifest.json` declares the app name, short name, start URL, display mode, theme color, background color, and icons at 192 and 512 pixels.

`public/sw.js` is the service worker. On install it pre-caches the four app shell routes. On fetch it attempts the network first and falls back to the cache on failure. On activate it removes stale caches from previous versions.

`public/icons/icon-192.png` and `public/icons/icon-512.png` are the app icons used by the manifest and by the browser on install.

`src/app/layout.tsx` registers the service worker via an inline script that runs on page load, guarded by a `serviceWorker in navigator` check for browser compatibility.

After the app has been loaded once, the shell routes are available from cache and the app will not hard-crash when the device is offline.

---

## Implementation Map — TRD to Code

| TRD Section | Implementation |
|---|---|
| Route contract — `/` | `src/app/page.tsx` — splash screen with 1.2s delay, then redirects |
| Route contract — `/login` | `src/app/login/page.tsx` + `src/components/auth/LoginForm.tsx` |
| Route contract — `/signup` | `src/app/signup/page.tsx` + `src/components/auth/SignupForm.tsx` |
| Route contract — `/dashboard` | `src/app/dashboard/page.tsx` + `src/components/shared/ProtectedRoute.tsx` |
| Persistence contract | `src/lib/storage.ts` + `src/lib/constants.ts` |
| Type contracts | `src/types/auth.ts`, `src/types/habit.ts` |
| `getHabitSlug` | `src/lib/slug.ts` |
| `validateHabitName` | `src/lib/validators.ts` |
| `calculateCurrentStreak` | `src/lib/streaks.ts` |
| `toggleHabitCompletion` | `src/lib/habits.ts` |
| Auth behavior rules | `src/lib/auth.ts` |
| Habit behavior rules | `src/lib/habits.ts` + `src/components/habits/HabitForm.tsx` |
| Splash screen UI | `src/components/shared/SplashScreen.tsx` |
| Habit card UI + test IDs | `src/components/habits/HabitCard.tsx` |
| Habit list + empty state | `src/components/habits/HabitList.tsx` |
| PWA contract | `public/manifest.json`, `public/sw.js`, `public/icons/` |
| Package scripts | `package.json` |

---

## Test File Map

**`tests/unit/slug.test.ts`**
Verifies `getHabitSlug` from `src/lib/slug.ts`. Checks that names are lowercased and hyphenated, that outer spaces are trimmed and internal spaces collapsed, and that non-alphanumeric characters are stripped.

**`tests/unit/validators.test.ts`**
Verifies `validateHabitName` from `src/lib/validators.ts`. Checks that empty input is rejected with the required message, that names over 60 characters are rejected, and that valid names are returned trimmed.

**`tests/unit/streaks.test.ts`**
Verifies `calculateCurrentStreak` from `src/lib/streaks.ts`. Checks the zero cases, consecutive day counting, duplicate date handling, and gap detection that breaks a streak.

**`tests/unit/habits.test.ts`**
Verifies `toggleHabitCompletion` from `src/lib/habits.ts`. Checks that dates are added when absent, removed when present, that the original habit object is not mutated, and that duplicates cannot appear in the returned completions array.

**`tests/integration/auth-flow.test.tsx`**
Renders `SignupForm` and `LoginForm` in a jsdom environment and verifies the full auth flow: successful signup creates a session, duplicate email is rejected with the required message, successful login stores the session, and invalid credentials show the required error message.

**`tests/integration/habit-form.test.tsx`**
Renders `HabitList` with a seeded session and verifies habit interactions: empty name shows a validation error, a new habit appears in the list after creation, editing preserves the id, userId, createdAt, and completions fields, deletion only completes after the confirm button is clicked, and toggling completion updates the streak display immediately.

**`tests/e2e/app.spec.ts`**
Full browser tests using Playwright against the production build. Covers all ten required scenarios: splash screen redirect, authenticated redirect, protected route enforcement, signup, login with scoped habits, habit creation, streak toggle, persistence across reload, logout, and offline shell availability.