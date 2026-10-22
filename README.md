# Yashwant K S: Portfolio Website (v2)
Plain HTML, CSS and JavaScript. No frameworks, no build step.

## Run locally
Open `index.html` in any browser.

## Folder structure
- index.html
- admin.html (dashboard)
- css/style.css
- js/script.js


## Design
Paddy-green and marigold palette, Bricolage Grotesque + Instrument Sans fonts, top navigation, expandable project rows, light and dark themes. Change colours in the `:root` and `[data-theme="dark"]` blocks at the top of `css/style.css`.

## Admin dashboard
Open `admin.html` (demo password: `admin123`). Projects, skills and profile changes made there now appear on `index.html`, and contact-form messages appear in the admin inbox. Both pages must be opened in the same browser on the same site, because data is stored in localStorage. The sign-in is a frontend demo only, not real security. For a live multi-device site, connect it to Firebase or Supabase.

## Deploy on GitHub Pages
1. Create a public repository and upload all files (keep the folders).
2. Settings, Pages, Branch: main, folder: / (root), Save.

## Personalise
- Email, GitHub and LinkedIn: edit in admin Settings, or in `js/script.js` defaults.
- Contact form: use Formspree or EmailJS to receive real emails.
