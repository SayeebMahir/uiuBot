# uiuBot (MERN + 2FA + RAG)

Quick start:

- Server
  - Copy `server/.env.example` to `server/.env` and set values
  - Ensure MongoDB is running locally or set a MongoDB Atlas URI
  - From `server/`: `npm run dev`
- Client
  - From `client/`: `npm run dev`
  - Open http://localhost:5173

Server env keys:
- PORT=5000
- NODE_ENV=development
- CORS_ORIGIN=http://localhost:5173
- MONGO_URI="mongodb+srv://omar1424:omar1424%40@omar1424.nxp7fua.mongodb.net/uiuBot?retryWrites=true&w=majority&appName=omar1424"

- JWT_ACCESS_SECRET=change_me_access
- JWT_REFRESH_SECRET=change_me_refresh
- COOKIE_NAME=uiu_sid
- SMTP_HOST= (optional)
- SMTP_PORT=587
- SMTP_USER=
- SMTP_PASS=
- EMAIL_FROM=no-reply@uiubot.local
- OTP_EXPIRY_SEC=300

Security features:
- Strong password policy (min 12, upper/lower/number/special)
- 2FA via email OTP (TOTP-ready)
- HTTP-only cookie for session, JWT access tokens
- Helmet, CORS, rate limiting, sensitive log redaction

RAG roadmap:
- Admin ingest routes to upload documents
- Embedding + chunking + retrieval + model generation
- University-themed prompt and sources display
