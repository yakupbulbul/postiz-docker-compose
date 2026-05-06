# Postiz Mobile Custom Assets

These files are injected into every HTML page via nginx `sub_filter`.

## Files
- `mobile.css` — Responsive CSS overrides (5 areas: foundation, bottom-nav, header, calendar, UX polish)
- `mobile.js`  — Bottom navigation bar injection + Next.js route tracking

## How it works
`nginx.conf` at the repo root overrides the container's `/etc/nginx/nginx.conf`.
The `sub_filter` directive appends `<link>` and `<script>` tags just before `</head>`.
