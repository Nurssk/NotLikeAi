# Firestore rules — waitlist

The waitlist form writes signups to the **`waitlist`** collection in Firestore.
If signups are not saving, the cause is almost always that **Firestore security
rules are blocking the write** (you'll see `permission-denied` in the browser
console). Apply the rules in [`firestore.rules`](./firestore.rules).

## How to apply (Firebase Console — no CLI needed)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`PUBLIC_FIREBASE_PROJECT_ID` in `.env`).
3. Go to **Build → Firestore Database**.
   - If you don't have a database yet, click **Create database** (Production mode
     is fine — these rules add the needed access) and pick a location.
4. Open the **Rules** tab.
5. Delete the existing contents and **paste the full contents of `firestore.rules`**.
6. Click **Publish**.

Writes from the landing page should work within a few seconds.

## What these rules do (MVP)

- **Create / update allowed** on `waitlist/{docId}` for anyone, but only when the
  document contains *exactly* the expected fields
  (`email`, `normalizedEmail`, `source`, `page`, `userAgent`, `createdAt`,
  `updatedAt`) and `source == "landing"`.
- **Reads are disabled** (`allow read: if false`) — visitors cannot list or read
  other people's emails. This is why the frontend does **not** read before
  writing.
- **Deletes are disabled.**
- **Polar/payment collections stay locked** from browser clients. Polar checkout
  uses the server route and `POLAR_ACCESS_TOKEN`; it does not need Firestore
  browser write access.
- **Authenticated user collections stay locked** until there is a concrete
  account/profile flow. The waitlist does not require Google sign-in.
- Every other collection stays fully locked.

## If it still does not save

Check the browser console:

- `permission-denied`: the published Firebase Console rules do not match this
  file, or Firestore App Check enforcement is enabled without App Check being
  initialized in the client.
- `failed-precondition`: the Firestore database may not exist yet for the
  configured project.
- `unavailable` / network errors: browser extension, ad blocker, network, or
  Firebase service connectivity.

Also verify production environment variables in Vercel:

- `PUBLIC_FIREBASE_PROJECT_ID` must point to the same Firebase project where you
  published the rules.
- `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`,
  `PUBLIC_FIREBASE_APP_ID`, and related public Firebase values must be present.
- Keep `POLAR_ACCESS_TOKEN` server-only. Do **not** rename it to
  `PUBLIC_POLAR_ACCESS_TOKEN`.

## Notes

- These are intentionally simple MVP rules. There is no spam/rate limiting — for
  production you'd add App Check, auth, or a Cloud Function write proxy.
- To read the collected emails, use the **Firebase Console** or the Admin SDK
  (server-side). The public web app cannot read the list by design.
- Optional CLI deploy (only if you use the Firebase CLI):
  `firebase deploy --only firestore:rules`. The console copy/paste method above
  is enough and requires no setup.
