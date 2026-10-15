# Paytm Intelligence: client onboarding portal

Static site (no build step). Customers pick WhatsApp, SMS or RCS, fill the in-page form, and the answers are
sent to the original Google Form, so responses and notification emails work as before.

## Structure

```
index.html        page markup
css/styles.css    all styling
js/config.js      settings: form IDs, field IDs, logo, test flags  (the file you edit)
js/app.js         form definitions, validation, submit, welcome dialog
.nojekyll         tells GitHub Pages to serve files as they are
```

## Deploy on GitHub Pages

1. Keep `index.html`, `css/`, `js/` and `.nojekyll` at the repository root (or in `/docs`).
2. Repository **Settings > Pages > Build and deployment**: source = *Deploy from a branch*, choose your branch and `/ (root)` (or `/docs`).
3. After each change, bump the `?v=1.0.0` on the CSS and JS links in `index.html` so visitors do not get cached files.

## Configuration (`js/config.js`)

- **ENTRY**: Google field IDs per form. The WhatsApp map is filled in. SMS and RCS must be added before they can submit.
  The snippet to generate each map is in the file comments.
- **HIDDEN_SELECT_VALUE**: see the comment in the file. The simplest fix is to make
  "If Yes, who is the current BSP?" optional in the WhatsApp Google Form.
- **LOGO_SRC**: path to the official Pi logo, for example `img/pi-logo.svg`. Empty shows the built-in wordmark.
- **ENABLE_TEST_MODES**: keep `false` on the live site. Set `true` temporarily to use `?preview` (fake success) or
  `?debug` (opens Google's real response page in a new tab).

## Testing a submission

Submit a real entry on each tab, confirm it appears in the Google response sheet and that the expected email arrives,
then delete the test rows.

## Behaviour notes

- All visible fields are required. Conditional fields appear only when relevant; hidden text fields are sent as `N/A`.
- The welcome pop-up shows once per browser (stored in `localStorage`) and appears again after site data is cleared.
- Do not rename form questions in Google Forms without updating the matching labels in `js/app.js` and the keys in `js/config.js`.

## Optional hardening

GitHub Pages cannot set HTTP headers. If you want a Content Security Policy, add this inside `<head>` and test every form afterwards:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src https://docs.google.com https://accounts.google.com; form-action https://docs.google.com; base-uri 'none'; object-src 'none'">
```

## RCS image upload (logo and banner)

In the RCS form, "Agent Logo" and "Hero Image / Banner" accept either a pasted link or an uploaded image.
Only JPG / JPEG files are accepted (checked by file extension and by the file's actual contents). The sizes in
`IMAGE_RULES` in `js/config.js` are enforced on upload; remove a number there to stop checking it.

Google Forms cannot receive files from a website, so an upload is first saved to Google Drive and the resulting
link is sent in the existing form field. This needs a small Google Apps Script:

1. Follow the steps at the top of `upload-apps-script.gs` (create a Drive folder, paste the script, deploy as a web app
   with access "Anyone").
2. Paste the web app URL into `UPLOAD_URL` in `js/config.js`.
