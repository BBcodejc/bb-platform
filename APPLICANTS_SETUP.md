# Applicants: where they go + how to set it up

Every application from **basketballbiomechanics.com/apply** now does three things:

1. **Appends a row to your Google Sheet** (your durable record + email list).
2. **Emails the team** at `bbcodejc@gmail.com` (reply-to is the applicant, so you can reply directly).
3. **Sends the applicant one confirmation email** — "Application received… Measured. Not promised." — and nothing after that.

The Google Sheet is the system of record. Even if email ever fails, the applicant is still captured in the Sheet (and vice-versa).

---

## One-time setup (about 5 minutes)

### 1. Create the Sheet
- Go to <https://sheets.google.com> and create a new spreadsheet. Name it **BB Applicants**.

### 2. Add the script
- In the Sheet: **Extensions → Apps Script**.
- Delete the starter code, paste the contents of [`applicants-sheet.gs`](applicants-sheet.gs).
- Replace `REPLACE_WITH_A_LONG_RANDOM_STRING` with a long random string (e.g. run `openssl rand -hex 24` in a terminal, or mash the keyboard). **Keep a copy** — you need the same value in step 4.
- Click **Save**.

### 3. Deploy it as a Web App
- **Deploy → New deployment**.
- Click the gear → **Web app**.
- Set: **Execute as = Me**, **Who has access = Anyone**.
  *(“Anyone” is required so the site can reach it. The shared secret is what actually protects it — random requests with no secret are rejected.)*
- **Deploy**, approve the permissions prompt, then **copy the Web app URL** (ends in `/exec`).

### 4. Add two environment variables to the site (Vercel)
In the Vercel project for `bb-platform` → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `GOOGLE_SHEET_WEBHOOK_URL` | the `/exec` URL from step 3 |
| `GOOGLE_SHEET_SECRET` | the same random string from step 2 |

Also confirm `RESEND_API_KEY` is already set (it powers the emails). Then **redeploy** so the new variables take effect.

> Local testing: put the same two values in `bb-platform/.env.local`.

### 5. Test
- Open `/apply`, submit a test application.
- You should see: a new row in the Sheet, a notification email at `bbcodejc@gmail.com`, and a confirmation email at the address you used.

---

## Where you see applicants

- **The Google Sheet** — sortable, filterable, and exportable to CSV (File → Download). This doubles as your email list: the **Email** column is your send-to list.
- **Gmail** (`bbcodejc@gmail.com`) — a copy of every application as it arrives.

## Is it secured?

What's in place: requests without the secret are rejected; the secret and API keys live only in server env vars (never in the browser); inputs are length-capped and HTML-escaped before emailing (no injection); per-IP rate limiting and a bot honeypot; everything moves over HTTPS.

Honest caveats: the Sheet/inbox are protected by your Google account security — turn on 2-factor auth for `bbcodejc@gmail.com` and the Google account that owns the Sheet. The shared secret is what guards the Sheet endpoint, so don't paste it anywhere public. Rotate it (steps 2 + 4) if it's ever exposed.
