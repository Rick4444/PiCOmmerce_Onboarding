# Paytm Intelligence: client onboarding portal

A static website (no build step) where clients choose WhatsApp, SMS or RCS, complete the onboarding questionnaire
in the page, and submit. Answers go to the original Google Forms, so responses, response sheets and notification
emails work exactly as before.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `styles.css` | All styling (phone, tablet, laptop, large monitor) |
| `app.js` | Forms, validation, auto-saved drafts, submit, loaders, welcome pop-up |
| `config.js` | Settings: form IDs, field IDs, where each form submits, logo, test flags |
| `upload-apps-script.gs` | Optional: lets RCS clients upload JPG/JPEG images (saved to Google Drive) |
| `whatsapp-sheet-apps-script.gs` | Optional: submit WhatsApp answers straight into a Google Sheet instead of the form |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

All files sit in one folder (repository root or `/docs`).

## Publish on GitHub Pages

1. Put the files in the repository root (or `/docs`).
2. **Settings > Pages**: deploy from your branch and folder.
3. After every change, raise the `?v=` number on the three file links in `index.html` so visitors get fresh files.

## Current configuration (`config.js`)

- `TARGETS`: `whatsapp`, `sms` and `rcs` all submit to their Google Form (`"form"`).
  Set one to `"sheet"` to send it to a Google Sheet instead (needs `SHEET_URL`, see below).
- `FORM_IDS` and `ENTRY` link each field to its Google Form question. They match the question titles exactly:
  if a question is renamed or reordered in a Google Form, update `ENTRY` and the label in `app.js`.
- `UPLOAD_URL`: address of the RCS image-upload script. Empty means clients can still paste a link.
- `ENABLE_TEST_MODES`: keep `false` on the live site.

## Behaviour

- All visible fields are required, with format checks (email, phone, links, hex colour, dates, 5-10 RCS test numbers).
- Follow-up questions appear only when relevant; hidden text answers are sent as `N/A`.
- Answers are auto-saved in the client's browser until the form is submitted or cleared (kept up to 30 days).
- A loading overlay shows while submitting, with an extra notice on slow connections; requests time out after 30 seconds
  and show an error with a reference code, for example `(Ref: TIMEOUT-WHATSAPP)`.
- The welcome pop-up shows once per browser.

## RCS image upload (optional)

JPG / JPEG only, with the size checks in `IMAGE_RULES`. Deploy `upload-apps-script.gs` as an Apps Script web app
(Execute as: Me, access: Anyone) and put its `/exec` address in `UPLOAD_URL`. Run `testSetup` once in the script editor
to grant Drive access. This needs a Google account that is allowed to publish web apps to "Anyone".

## WhatsApp to a Google Sheet (optional)

Deploy `whatsapp-sheet-apps-script.gs` the same way, put its `/exec` address in `SHEET_URL` and set
`TARGETS.whatsapp` to `"sheet"`. To use an existing sheet, set `SHEET_ID` and `SHEET_NAME` in the script; answers are
matched to columns by header name.

## Before going live

- Submit one real test entry per channel and confirm it reaches the right response sheet and the usual email arrives.
- Replace the code-drawn Pi wordmark with the official logo: add the file and set `LOGO_SRC` in `config.js`.
- Delete test rows from the response sheets.
