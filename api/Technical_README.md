# Technical Documentation

Technical implementation overview for the URL Shortener & Analytics Platform.

## 1. Technology Stack

### Backend

- **Node.js**
- **Fastify**
- **TypeScript**
- **PostgreSQL**
- **Drizzle ORM**
- **Zod** — request validation

---

## 2. Project Architecture

The backend follows a modular structure where business functionality is separated into modules.

Core modules:

```text id="3f2wqm"
auth
user
url
analytics
```

Each module contains its relevant:

- Routes/controllers
- Services/business logic
- Repositories/database operations
- Schemas/validation

The database layer is handled through Drizzle ORM.

---

## 3. Authentication

### Registration

```text id="v5w8d3"
Email + Password
       ↓
Validate input
       ↓
Hash password
       ↓
Create user
```

Passwords are hashed using **Argon2id**, a modern password-hashing algorithm designed specifically for password storage.

Passwords are never encrypted or stored in plaintext.

### Login

```text id="tq2n0p"
Email + Password
       ↓
Find user
       ↓
Verify Argon2id hash
       ↓
Generate access token
       ↓
Generate refresh token
```

---

## 4. Token Authentication

The application uses two token types.

### Access Token

- JWT-based
- Short-lived
- Sent with authenticated API requests
- Contains the authenticated user's identity
- Validated by the backend

### Refresh Token

- Cryptographically secure random string
- Long-lived
- Stored as a hash in PostgreSQL
- Used to issue new access tokens
- Can be revoked

The refresh token is not a JWT.

### Refresh Flow

```text id="e7q8yz"
Refresh Token
      ↓
Hash / lookup
      ↓
Validate session
      ↓
Issue new Access Token
```

---

## 5. Short URL Generation

The system uses a unique internal ID and **Base62 encoding** to generate compact short codes.

Base62 character set:

```text
0-9
a-z
A-Z
```

Generation:

```text id="f4g1zn"
Unique ID → Base62 → Short Code
```

Example:

```text id="n5u8m2"
ID: 125874
      ↓
Base62
      ↓
w7K2
```

The generated short code is stored with the URL and protected by a database uniqueness constraint.

This approach avoids generating random strings repeatedly and checking for collisions for every URL.

---

## 6. URL & UTM Processing

A URL creation request contains:

```text id="7s5f6k"
original_url
utm_source
utm_medium
utm_campaign
utm_term
utm_content
```

The API validates the input using Zod before creating the URL.

UTM configuration is stored separately from the URL record.

During redirect, the configured UTM parameters are added to the destination URL while preserving valid existing query parameters.

The exact parameter merge/precedence rules are implemented in the URL service.

---

## 7. Redirect Handling

A short URL request follows this general process:

```text id="0s2s5e"
GET /:shortCode
      ↓
Find URL by shortCode
      ↓
Check URL status/expiration
      ↓
Collect request information
      ↓
Create analytics event
      ↓
Build destination URL + UTM
      ↓
Redirect
```

The short-code lookup uses the indexed `short_code` column.

A redirect response such as **HTTP 302** can be used so requests continue reaching the service and clicks can be recorded.

---

## 8. Analytics

Each redirect generates an analytics event containing the required dimensions.

Collected dimensions include:

### Technology

- Browser
- OS
- Device

### Geography

- Country
- Region
- City
- Continent

### UTM

- Source
- Medium
- Campaign
- Term
- Content

Browser, OS, and device information can be derived from the request's **User-Agent**.

Geographic information is derived from the request IP using an IP geolocation service/database.

Analytics data is stored as click events and aggregated through database queries for dashboard charts and tables.

---

## 9. Analytics Dashboard

Dashboard APIs provide aggregated data for:

- Total clicks
- Clicks over time
- Browser distribution
- OS distribution
- Device distribution
- Country/region/city distribution
- UTM source/medium/campaign/content/term

Queries should support filtering by:

- URL
- Date/time range
- Analytics dimension

Indexes are added according to the actual query patterns.

---

## 10. Validation & Error Handling

**Zod** is used to validate:

- Request bodies
- Query parameters
- URL/UTM input
- Authentication-related input

The API uses consistent HTTP status codes and structured error responses.

Common cases include:

- `400` — invalid request
- `401` — unauthenticated/invalid authentication
- `403` — unauthorized operation
- `404` — resource/short URL not found
- `409` — resource conflict
- `429` — rate limit exceeded
- `500` — unexpected server error

---

## 11. Security

Important security measures include:

- Argon2id password hashing
- Short-lived JWT access tokens
- Cryptographically secure refresh tokens
- Hashed refresh-token storage
- Token revocation
- Input validation
- URL validation
- Rate limiting on sensitive endpoints
- CORS configuration
- Security-focused HTTP headers
- Authorization checks for user-owned resources

---

## 12. Performance & Scalability

The redirect path is the highest-read operation.

Important optimizations include:

- Indexed short-code lookup
- Efficient PostgreSQL queries
- Stateless API instances
- Caching frequently accessed URL mappings when required
- Keeping analytics processing lightweight on the redirect path
- Moving heavy analytics aggregation to background processing as traffic increases

The application can be horizontally scaled by running multiple backend instances behind a load balancer.

---

## 13. API Structure

Core API areas:

```text id="5v5s4h"
Auth
 ├── Register
 ├── Login
 ├── Refresh
 └── Logout

User
 └── Get Current User

URL
 ├── Create
 ├── Get
 ├── Update
 └── Delete

Redirect
 └── GET /:shortCode

Analytics
 └── Dashboard / Reports
```

API request/response schemas are validated at the API boundary, while business logic remains inside the respective services.

---

## 14. Environment Configuration

Sensitive configuration is provided through environment variables.

Examples:

```text id="7v6t3j"
DATABASE_URL
JWT_SECRET
JWT_ACCESS_EXPIRY
REFRESH_TOKEN_EXPIRY
BASE_URL
```

Secrets must not be committed to source control.
