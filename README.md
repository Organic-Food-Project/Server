# Organic Food API

A backend API for an organic food e-commerce store. Built with Express, MongoDB, JWT auth, Stripe checkout, ImageKit uploads and full CRUD for products, categories, reviews, wishlist and cart.

## Tech stack

- Node.js, Express
- MongoDB + Mongoose
- JWT authentication
- Multer (memory storage)
- Stripe API + webhook
- ImageKit image uploads
- Joi validation, file-type validation
- Vercel deployment ready

## Key features

- User signup/login with JWT protection
- Profile update (profile data, password, image)
- Product CRUD (admin only)
- Category CRUD (admin only)
- Product reviews
- Wishlist
- Cart: add / update / remove items
- Stripe checkout + webhook handling
- Image upload & validation (png/jpg/jpeg/webp/svg)
- Auto-create first admin on initial DB connect

## Quick start

1. Clone repo:
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

  - GET /
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
  - POST /webhook-checkout (raw body required)

## Example requests

Signup:

```sh
curl -X POST https://api.example.com/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

Get products:

```sh
curl https://api.example.com/api/v1/products
```

Create Stripe checkout session (server endpoint):

```sh
curl "https://api.example.com/api/v1/checkout"
```

Webhook:

- Configure Stripe to call `/api/v1/checkout/webhook-checkout`.
- Ensure webhook request uses raw body and `STRIPE_WEBHOOK_SECRET` is set.

## Folder structure (high level)

- app.js — Express app, middleware
- Mongodb.js — DB connection + first admin creation
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

## Deployment

- Vercel-ready: `index.js` exports the app for serverless deployments.
- Ensure env vars are configured in target environment (Vercel or other).
- For Stripe webhooks in Vercel, use raw body route configuration that matches `app.js` settings.

## Contributing

- Follow existing controllers & route patterns.
- Use `AppError` and `Response` for errors/responses.
- Add tests where appropriate.

## License

ISC (see package.json)

## Base API URL

https://organicfood-server.vercel.app/api/v1
