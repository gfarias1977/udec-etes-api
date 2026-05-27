# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm start            # Start server (port 3005)
npm run debug        # Start with Node inspector
npm run swagger      # Regenerate Swagger docs (src/swagger-output.json)
```

No test suite is configured.

## Architecture

REST API built with **Express + PostgreSQL** (`pg` pool), deployed on Vercel. Entry point: `src/server.js`. All endpoints are prefixed `/api/v1`. Swagger UI at `/api/v1/doc`.

### Layer structure under `src/`

```
routes/v1/          → Express route files (80+), one per resource
mvc/v1/controller/  → Request handlers — validate → call model → respond
mvc/v1/model/       → SQL queries using parameterized $1/$2... placeholders
middleware/
  auth.middleware.js            → JWT verification, attaches req.userId / req.company
  awaitHandlerFactory.middleware.js → wraps async handlers for error propagation
  error.middleware.js           → catches HttpException, sends JSON error response
  validators/                   → express-validator schemas, one file per resource
services/
  database.js       → pg connection pool (env: DATABASE_URL)
  webapp.js         → Express app config (CORS, body parser, route loading)
config/config.js    → validates required env vars on startup
utils/HttpException.utils.js → custom error class (status, message, optional data)
```

### Route pattern

```js
router.METHOD('/path', auth, validator, awaitHandlerFactory(controller.method))
```

`auth` is optional for public endpoints. Validators run before the controller.

### Controller pattern

```js
checkValidation(req);        // throws HttpException if express-validator found errors
const result = await Model.someMethod(params);
res.status(result.status).json(result);
```

### Model response shape

All model functions return:
```js
{ type: 'ok'|'error', status: 200|400|500, message: '...', [dataKey]: [...] }
```

### Authentication

JWT Bearer tokens. `auth` middleware reads `Authorization: Bearer <token>`, verifies with `JWT_ACCESS_TOKEN_SECRET`, exposes `req.userId` and `req.company`.

### Multi-tenancy

Most queries filter by `user_company_id` (from `req.company`).

## Environment Variables

```
DATABASE_URL                    # PostgreSQL connection string (required)
NODE_ENV                        # development | production
PORT                            # default 3005
JWT_ACCESS_TOKEN_SECRET
JWT_ACCESS_TOKEN_EXPIRES_IN     # e.g. 24h
JWT_REFRESH_TOKEN_SECRET
JWT_REFRESH_TOKEN_EXPIRES_IN
```

## Adding a new resource

1. `src/routes/v1/<resource>.route.js` — define routes
2. `src/mvc/v1/controller/<resource>.controller.js` — controllers
3. `src/mvc/v1/model/<resource>.model.js` — SQL queries
4. `src/middleware/validators/<resource>Validator.middleware.js` — validators
5. Register in `src/routes/routes.js`

## Known issues

- `src/helpers/sendMail.helper.js` has hardcoded SMTP credentials — should use env vars.
- CORS whitelist in `webapp.js` is hardcoded to specific frontend URLs; update before deploying to a new environment.
