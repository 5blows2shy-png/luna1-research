# Luna Books recording checklist

## Setup

- **Browser:** 1440 × 900 recommended; 1280 × 800 minimum; 100% zoom.
- **Demo route:** `http://localhost:3000/demo/luna-books-tour`
- **Demo login:** None. The local-only route loads an isolated fictional workspace.
- Run `npm run dev`. The same read-only route is available publicly without a login.
- **Reset:** Click **Restart** or reload. Frozen data comes from `src/lib/luna-books-demo.ts`; there is no database or persistent browser state to reset.

## Recording order

1. Hide bookmarks, extensions, developer tools, notifications, and password overlays.
2. Confirm the “Safe demo data” badge and Harbor Supply Co. are visible.
3. Use **Next** through all twelve scenes.
4. In Scene 10, briefly show Conservative, then return to Expected.
5. Hold the final Luna Books message for five seconds.

Alternatively, select **Auto Play** to advance using the voiceover timing assigned to each scene. Pause before Scene 10 if you want to demonstrate its forecast scenarios manually.

## Animation and audio

- Scene change: subtle 350 ms transition; progress bar: 250 ms.
- Auto Play adds a scene-duration indicator and uses the script timing automatically.
- Ambient prism motion uses Luna1’s original blue, violet, and warm-orange spectrum.
- The forecast chart has animation disabled.
- Reduced-motion preferences disable tour transitions.
- Follow the script’s per-scene timing; total narration is about 3:40.

## Sensitive-information check

- Confirm no real browser autofill, customer tab, bank site, QuickBooks session, email, address, EIN, invoice, account number, `.env`, or developer tool appears.
- Confirm **Schedule payment** and **Send invitation** are disabled.
- Confirm QuickBooks says no OAuth token is loaded.
- Keep estimate disclaimers visible for runway and forecast.
