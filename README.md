# Golden Wings International

Premium React + Vite website for Golden Wings International LLC, built as a static GoDaddy-compatible SPA.

## Stack

- React
- Vite
- React Router
- GSAP + ScrollTrigger
- Lucide React icons

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The production files are generated in `dist/`. For basic GoDaddy/cPanel hosting, upload the contents of `dist/` into the website root, usually `public_html`.

The project includes `public/.htaccess` so direct visits and refreshes work for routes such as `/capabilities`, `/fleets`, `/about`, and `/contact`.

## Content Covered

- Multi-route website structure
- Minimal GSAP hero slider with 01/02/03 progress navigation
- Aircraft image, turbine video and helicopter image media sequence
- Aviation aftermarket positioning
- FAA and EASA traceability
- Avionics, hot parts and lot deals
- Supported fleets
- RFQ process
- Weekly push-list subscription
- Doral headquarters and contact information
