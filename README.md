# Fasfoor

A seafood restaurant application with a customer storefront, an administration dashboard and an Express API. The frontend uses React and Vite; the API stores data in MongoDB through Mongoose.

[Live site](https://fasfoor-project.vercel.app/)

## Repository

```text
client/                 React storefront and administration dashboard
  src/services/         Customer and administrator API clients
  test/                 API client and multipart payload tests
server/                 Express API
  src/controllers/      Request handlers
  src/models/           MongoDB schemas
  src/services/         Image storage and supporting services
  scripts/              Development data and initial administrator setup
  test/                 Controller, authentication, connection and upload tests
vercel.json             Service routing and SPA fallback
```

## Run locally

Use Node.js 22.12 or later and a separate development database. Install each application from its lockfile:

```bash
cd server
npm ci
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Edit `server/.env`:

- `MONGO_URI`: your development database URI. For Atlas, copy the hostname from **Connect** instead of typing it manually. URL-encode reserved characters in the database password.
- `JWT_SECRET`: a private random value of at least 32 characters. Generate one locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
- `CLIENT_URL`: the frontend origin, normally `http://localhost:5173`.

Start the API:

```bash
npm run dev
```

In another terminal:

```bash
cd client
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` and `/uploads` to port 5000, so `client/.env` is optional. If the API is hosted separately, copy `client/.env.example` and set `VITE_API_URL` to its public API URL. Never put database credentials or signing keys in a `VITE_*` variable: they are included in the browser bundle.

## Initial administrator

The application does not create a default administrator automatically. An empty database has no login account.

Set the following values in your private server environment:

```env
INITIAL_ADMIN_NAME=Your name
INITIAL_ADMIN_USERNAME=your-admin-email@example.com
INITIAL_ADMIN_PASSWORD=your-private-password
```

Use a password of at least 12 characters, then run:

```bash
cd server
npm run admin:create
```

This command only creates an initial super administrator when no active super administrator exists. It does not reset passwords, replace accounts or delete restaurant data. It requires a configured `JWT_SECRET`. Remove the `INITIAL_ADMIN_*` values after use and sign in at `/admin/login`.

Changing `JWT_SECRET` invalidates existing sessions. Administrator and customer tokens are separate; older administrator tokens without an audience type require a fresh login.

## Development data

```bash
cd server
npm run seed
```

Seeding is for an **empty development database only**. It refuses to run in production or when any target collection already contains records. It does not delete existing data.

The included menu, prices, contacts, customer and delivery information are demonstration data. Review them before using them for a real restaurant. On a failure, some demo records may already have been inserted; the command deliberately refuses to overwrite a partially populated database. Do not point it at a live database.

For production, create the first administrator with `admin:create`, then enter approved restaurant data through administrative tools or a reviewed import. No seed command runs during deployment.

## Vercel deployment

Import the repository as one Vercel project. `vercel.json` builds two services:

| Service | Root | Framework | Public routing |
| --- | --- | --- | --- |
| `client` | `client` | Vite | All non-API paths; SPA fallback to `index.html` |
| `server` | `server` | Express | `/api/*` |

The service-scoped SPA fallback lets `/menu`, `/branches` and `/admin/login` open directly and survive a page refresh. `/api/*` still reaches Express.

Configure these server variables in the required Vercel environments:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection, including the intended database name |
| `JWT_SECRET` | Private signing secret, at least 32 characters |
| `JWT_EXPIRES_IN` | Token lifetime; default `7d` |
| `CLIENT_URL` | Frontend origin if using cross-origin requests |
| `CLOUDINARY_CLOUD_NAME` | Persistent image storage |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary signing secret |

Keep credentials as Vercel Secret variables. Redeploy after changing environment variables. Production uses relative `/api` requests; do not set `VITE_API_URL` to `localhost` in production.

`GET /api/health` checks database connectivity before returning success. A database outage returns HTTP 503 without exposing the connection details to visitors. Connection attempts are shared by concurrent requests and can retry after failure.

## Images

The item editor supports an HTTPS image URL or a JPEG, PNG or WebP upload. Uploaded files are limited to 4 MiB and checked against their MIME type and file signature. The resulting image URL is saved on the item on both creation and update. Multipart array and boolean fields are parsed before validation.

Local development stores uploads in `server/uploads`, served through Vite's `/uploads` proxy. Vercel uploads require the three Cloudinary variables: the API will reject uploads when persistent storage is unavailable. An HTTPS image URL remains usable without Cloudinary. Cloudinary credentials stay on the server.

## Storefront

The homepage uses the existing Fasfoor identity with direct menu and branch navigation. Branch buttons select the branch before opening its menu. Navigation includes visible current-page and keyboard-focus states. Cart previews show item totals; delivery and discount calculations are reviewed during checkout. Offers are informational and use the existing telephone contact until an API-supported offer checkout is implemented.

The storefront follows the supplied black/gold references: dark public pages, warm cream item and checkout panels, orange order actions, and light operational admin content. Responsive grids and horizontally scrollable mobile category tabs preserve the same branch-driven flow. Production data is never taken from mockup counters, contact details, delivery estimates or sample prices.

`client/public/images/brand/seafood-hero.webp` is generated illustrative banner artwork, labelled as such on the homepage. Replace it with approved restaurant photography when available. Prompt: editorial Egyptian grilled seafood platter (sea bream, shrimp, calamari, lemon and parsley) on dark stone with warm gold side lighting, landscape composition, no text or logos. Created using the built-in image generation tool. Product and branch image fallbacks use the existing Fasfoor logo instead of broken image URLs or fabricated product photos.

## Order behavior

- Prices, add-ons, delivery charges and discounts are calculated by the API, not accepted from the browser's total.
- Pickup orders have no delivery fee or delivery address.
- Delivery orders require an address. A supplied zone must be active and belong to the selected branch. Without a zone, the current fallback delivery fee is 15 EGP.
- The branch must be open and its minimum order value must be met.
- Quantities must be integers from 1 to 100; a request is limited to 100 lines.
- New order numbers use `F-` followed by the order's MongoDB identifier. They do not depend on record counts and are not reused when orders are deleted. Existing order numbers remain unchanged.
- Non-super administrators can list and update orders only for their assigned branch.

## Validation

```bash
cd server
npm test

cd ../client
npm test
npm run build
```

Tests cover pickup and delivery pricing, rejected input, concurrent order identifiers, audience separation, inactive accounts, connection retries and image persistence. Controller and database tests use synthetic data and mocked model boundaries; multipart uploads run through a local HTTP server. Cloudinary requests are mocked. These tests do not prove live Atlas, SMS or payment-provider integration.

## Integrations still requiring configuration

Customer OTP works only during development. Production returns HTTP 503 before writing customer data and never logs verification codes. Order notifications are development mocks; neither service is connected to an SMS/WhatsApp provider. Card payments are disabled. Configure and test real providers before accepting live customer orders. The software should not be presented as a completed production checkout until those flows and the restaurant's actual data have been verified.

Never commit `.env` files, database passwords, JWT secrets or provider credentials. The repository includes examples containing placeholders only.
