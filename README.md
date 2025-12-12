# Organic Food API

A backend API for an organic food e-commerce store. Built with Express, MongoDB, JWT auth, Stripe checkout, ImageKit uploads and full CRUD for products, categories, reviews, wishlist and cart.

## Tech stack

- Node.js & Express
- MongoDB + Mongoose
- JWT authentication
- Multer (memory storage)
- Stripe API + webhook
- ImageKit image uploads
- Joi validation & file-type validation
- Vercel (deployment-ready)

## Key features

- User signup/login with JWT protection
- Profile update (profile data, password, image)
- Product CRUD (admin only)
- Category CRUD (admin only)
- Product reviews & rating aggregation
- Wishlist
- Cart: add / update / remove items
- Stripe checkout + webhook handling
- Image upload & validation (png/jpg/jpeg/webp/svg)
- Auto-create first admin on initial DB connect

## Latest updates / Recent features

- Role-based access control: Admin-only endpoints for create/update/delete operations.
- Product search, filter, sort, and pagination for improved browsing performance.
- Multiple images per product with ImageKit storage and image deletion support.
- Aggregated review metrics (average rating, review counts) returned in product payloads.
- Wishlist helper middleware (inWishlist) to indicate whether a product is in a user's wishlist.
- Improved Joi validation schemas for request payloads and centralized validation middleware.
- Centralized AppError & Response helpers for consistent API responses and error handling.
- Stripe improvements: metadata attachment to sessions & robust webhook signature verification using STRIPE_WEBHOOK_SECRET.
- Image upload validation using file-type to validate actual content type (not only file extension).
- Project is Vercel-ready with serverless entry (`index.js`).

## Quick start

1. Clone the repo:
   ```sh
   git clone <repo-url>
   cd "Organic Food"
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create `.env` with required variables (see below).
4. Run locally:
   ```sh
   npm run dev
   ```

## Environment variables

Add these to `.env`:

- MONGODB_URI — MongoDB connection string
- ATLAS_PASSWORD — Atlas DB password (if used)
- JWT_SECRET — JWT signing secret
- JWT_EXPIRES_IN — JWT expiry (e.g. 7d)
- SALT_FOR_PASSWORD — password salting value
- STRIPE_SECRET_KEY — Stripe secret key
- STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret
- IMAGEKIT_PUBLIC_API — ImageKit public key
- IMAGEKIT_PRIVATE_API — ImageKit private key
- IMAGEKIT_ENDPOINT — ImageKit endpoint URL
- FIRST_ADMIN_EMAIL — email for auto-created admin
- FIRST_ADMIN_PASSWORD — password for auto-created admin
- PORT — server port
- FrontEnd — frontend origin (for CORS/redirects)

Notes:

- Stripe webhook endpoint requires raw body parsing; configured in `app.js`.
- Image validation uses `file-type`.
- Ensure FIRST_ADMIN_EMAIL/PASSWORD are set to auto-create an initial admin user.

## Routes (brief)

Base route groups and main endpoints. See `routes/` for details.

- Users (`/api/v1/users`)

  - POST /signup
  - POST /login
  - GET / (protected)
  - PUT /updatepassword
  - PUT /updateuser
  - PUT /updateImage

- Products (`/api/v1/products`)

  - GET / (supports pagination / filter / sort / search)
  - GET /:name
  - POST / (admin + images)
  - PATCH /:id
  - DELETE /:id

- Categories (`/api/v1/categories`)

  - GET /
  - POST / (admin + image)
  - DELETE /:name

- Cart (`/api/v1/cart`)

  - POST /
  - PATCH /
  - DELETE /
  - GET /

- Wishlist (`/api/v1/wishlist`)

  - GET /
  - POST /
  - DELETE /

- Reviews (`/api/v1/reviews`)

  - GET /
  - POST /
  - DELETE /

- Checkout & Webhook (`/api/v1/checkout`)
  - GET / (create checkout session)
  - POST /webhook-checkout (raw body required; verifies Stripe signature)

## Example requests

Signup:

```sh
curl -X POST https://api.example.com/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

Get products (example with pagination & filters):

```sh
curl "https://api.example.com/api/v1/products?page=1&limit=12&category=fruits&sort=-price&search=apple"
```

Create Stripe checkout session (server endpoint):

```sh
curl "https://api.example.com/api/v1/checkout"
```

Webhook:

- Configure Stripe to call `/api/v1/checkout/webhook-checkout`.
- Ensure webhook requests are sent with raw body and that `STRIPE_WEBHOOK_SECRET` is set.

## Folder structure (high level)

- app.js — Express app & middleware configuration
- Mongodb.js — DB connection & initial admin creation
- index.js — Vercel/serverless entry
- routes/ — route definitions
- controllers/ — request handlers
- modles/ — Mongoose schemas
- middlerwares/ — middlewares (validation, uploads, Response helper)
- utils/ — helpers (AppError, validations)
- vercel.json — deployment config

## Architecture notes

- Controller → service → model pattern
- All controllers use `AppError` and `Response` helpers
- Image uploads use Multer memory storage + ImageKit via `middlerwares/Image_kit.js`
- File-type used to validate incoming images
- Raw Stripe webhook body is handled in `app.js` and verified in `controllers/checkoutControllers.js`

## Deployment

- Vercel-ready: `index.js` exports the app for serverless deployments.
- Ensure environment variables are configured in the deployment environment.
- For Stripe webhook on Vercel, ensure the webhook route is set up to receive raw request bodies and verify signatures.

## Contributing

- Follow existing controllers & route patterns.
- Use `AppError` and `Response` for standardized responses and error handling.
- Add tests and document new endpoints when adding features.

## License

ISC (see package.json)

## Base API URL

https://organicfood-server.vercel.app/api/v1
