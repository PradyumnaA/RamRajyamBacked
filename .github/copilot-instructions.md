<!-- Copilot instructions for this repository. Keep concise and actionable. -->
# Repository-specific instructions for AI coding agents

This Node.js backend uses Express + Mongoose and is organized by route → controller → model. Use these notes to be immediately productive and make safe, minimal changes.

- **Entry point**: `index.js` — mounts routes (`/api/users`, `/api/admin`, `/api/web`), configures CORS, static `uploads/`, and initializes sockets via `socket.js`.
- **Run / dev**: Use `npm install` then `npm run dev` (nodemon) or `npm start`. `package.json` defines `start: node index.js` and `dev: nodemon index.js`.
- **Environment**: Secrets and DB URL come from `.env` (see usage of `process.env.MONGODB_URL`, `PORT`, and AWS/Twilio credentials). Never log full secrets; prefer to log presence or masked values.

- **High-level architecture**:
  - `routes/` contain Express routers that delegate to `controllers/`.
  - `controllers/` implement request handling and call `models/` (Mongoose). Example pattern: `routes/userRoutes.js` → `controllers/userController.js`.
  - `models/` are Mongoose schemas and sometimes use `mongoose-sequence` for auto-increment counters.
  - File uploads use `multer` / `multer-s3` and helpers in `uploadMiddleware.js` and `s3.js`.
  - Real-time features use Socket.IO via `socket.js` and `initializeSocket(server)` in `index.js`.

- **Key integration points** (look here before changing behavior):
  - `s3.js` and usage of `@aws-sdk/*` — S3 multipart uploads and `multer-s3` patterns.
  - `auth.js` — JWT auth helpers used across routes.
  - `socket.js` — socket initialization and event wiring.
  - `utiles/email.js` — mail helper (nodemailer).
  - `package.json` — scripts and dependencies (Twilio, sharp, bcrypt, uuid, etc.).

- **Patterns & conventions to follow**:
  - Keep controller exports as functions that accept `(req, res)` and return JSON via `res.status(...).json(...)`.
  - Use existing middleware files (`uploadMiddleware.js`) rather than adding ad-hoc middleware in controllers.
  - Use async/await for DB calls; follow the existing connection pattern in `index.js` (mongoose connection with event listeners and graceful SIGINT close).
  - Do not hardcode credentials or DB URIs — use `process.env` and update `.env.example` only when requested.

- **Making changes safely**:
  - Small, targeted edits: update a controller, route, or model in isolation and run `npm run dev` to smoke-test.
  - For database-impacting changes, prefer backward-compatible migrations (add new fields with defaults).
  - When touching file upload / S3 code, validate with a local small-file upload and watch `uploads/` or the S3 bucket as appropriate.

- **Debugging & logs**:
  - `index.js` sets `mongoose.set('debug', true)` — keep or mirror that when adding DB queries to see executed queries.
  - Use the existing pattern of logging presence of env vars (e.g., `console.log('MONGODB_URL present?:', !!process.env.MONGODB_URL)`) instead of printing secrets.

- **What not to change without discussion**:
  - Global route prefixes (`/api/users`, `/api/admin`, `/api/web`) — these are relied on by clients.
  - Public API shapes returned by controllers — keep response fields stable for consumers.
  - Core dependency major upgrades (e.g., Mongoose, AWS SDK) without running full local integration tests.

- **Files to inspect for examples**:
  - `index.js` — server, DB connect, routes and sockets wiring.
  - `routes/userRoutes.js`, `controllers/userController.js`, `models/userModel.js` — user flow example.
  - `s3.js`, `uploadMiddleware.js` — file upload handling.
  - `socket.js` — real-time event init.
  - `utiles/email.js` — email sending pattern.

If you need to change global behaviors (auth, DB, upload), propose a short plan and run manual checks. Ask for environment values or test credentials if you cannot reproduce an integration locally.

If anything above is unclear or you want more examples from a specific controller/model, tell me which file and I'll add precise snippets. 
