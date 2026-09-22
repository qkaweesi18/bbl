# Braidz By Yolz Website

## Development

- Install dependencies (already done): `npm install`
- Start the development server with live‑reloading:
  ```bash
  npm start
  ```
  This launches **live‑server** on `http://127.0.0.1:5000`. The server injects a tiny script that automatically reloads the page whenever any file in the project directory changes.

## Production

The production build is deployed to Vercel (see `vercel --prod`). The live‑reloading server is only for local development; it is not included in the production deployment.

---

*Note: The `live-server` dev dependency is already listed in `package.json` and the `start` script is configured to watch the whole project folder.*