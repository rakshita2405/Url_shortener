# URL Shortener with Authentication (MERN)

## Overview
This project is a URL shortening service with user authentication. It includes:
- User registration, login, and profile via JWT.
- Protected URL creation (`/api/url/create`) and user URL listing (`/api/url/me`).
- URL redirecting (`/api/url/:slug`).
- Basic frontend React app to sign-in, generate short links, and view personal links.

## Tech stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Frontend: React (CRA)

## Server setup
1. `cd server`
2. Copy `.env.example` to `.env` and set values.
3. `npm install`
4. `npm run dev` to start local server (default `http://localhost:5000`).

### Environment variables
- `MONGO_URI` (Mongo connection URI)
- `BASE_URL` (for short links, e.g., `http://localhost:5000`)
- `JWT_SECRET` (strong secret)
- `JWT_EXPIRES_IN` (e.g., `7d`)
- `PORT` (API port)

## Frontend setup
1. `cd client`
2. `npm install`
3. `npm start`

Env option:
- `REACT_APP_API_BASE=http://localhost:5000/api`

## Test setup (server)
- `cd server`
- `npm test` (runs Jest tests in `src/__tests__`)

## API Endpoints
### Auth
- `POST /api/auth/register` payload: `{ username, email, password }`
- `POST /api/auth/login` payload: `{ identifier, password }` (identifier = email or username)
- `GET /api/auth/profile` requires `Authorization: Bearer <token>`

### URL
- `POST /api/url/create` requires auth + payload `{ longUrl, expiresAt? }`
- `GET /api/url/me` requires auth (user URLs)
- `GET /api/url/analytics/:slug` requires auth, owner only
- `GET /api/url/:slug` public redirect

## Notes
- The existing URL model supports `passwordHash` and `redirectRules` for future extension.
- Cleanup: Be sure to change hardcoded credentials in DB config to env-only.
