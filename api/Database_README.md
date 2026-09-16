# Database Design

PostgreSQL database design for the URL Shortener & Analytics Platform.

## 1. Database Stack

- **PostgreSQL** — primary database
- **Drizzle ORM** — schema definition and database queries
- **Drizzle Kit** — migrations

---

## 2. Core Tables

The database contains the following core entities:

```text
User
 │
 ├── Refresh Tokens
 │
 └── URLs
       │
       └── Analytics Events
```

### `users`

Stores registered user accounts.

Main data:

- User ID
- Email
- Password hash
- Created/updated timestamps

Constraints:

- Unique user ID
- Unique email

---

### `refresh_tokens`

Stores refresh-token sessions associated with users.

Main data:

- Refresh token ID
- User ID
- Refresh token hash
- Expiration timestamp
- Revocation timestamp
- Created timestamp

Relationship:

```text
users 1 ──── N refresh_tokens
```

Refresh tokens are stored as hashes rather than plaintext tokens.

---

### `urls`

Stores the short URL and its destination.

Main data:

- URL ID
- User ID
- Short code
- Original URL
- UTM parameters
- Expiration timestamp
- Created/updated timestamps

Relationship:

```text
users 1 ──── N urls
```

The `short_code` is unique and is the key used to resolve a short URL during redirection.

UTM parameters associated with a URL:

```text
utm_source
utm_medium
utm_campaign
utm_term
utm_content
```

---

### `url_analytics`

Stores analytics information generated when a short URL is accessed.

Main data:

- Analytics event ID
- URL ID
- Click timestamp
- Browser
- Operating system
- Device
- Country
- Region
- City
- Continent

Relationship:

```text
urls 1 ──── N url_analytics
```

Each redirect can generate an analytics event.

---

## 3. Entity Relationship

```text
┌──────────────┐
│    users     │
├──────────────┤
│ id           │
│ email        │
│ passwordHash │
└──────┬───────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌──────────────┐       ┌──────────────┐
│refresh_tokens│       │     urls     │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ user_id      │       │ user_id      │
│ token_hash   │       │ short_code   │
│ expires_at   │       │ original_url │
│ revoked_at   │       │ UTM params   │
└──────────────┘       │ expires_at   │
                       └──────┬───────┘
                              │
                              ▼
                       ┌────────────────┐
                       │ url_analytics  │
                       ├────────────────┤
                       │ id             │
                       │ url_id         │
                       │ clicked_at     │
                       │ browser        │
                       │ os             │
                       │ device         │
                       │ country        │
                       │ region         │
                       │ city           │
                       │ continent      │
                       └────────────────┘
```

## 4. Important Constraints & Indexes

### Users

- Primary key on `id`
- Unique index on `email`

### Refresh Tokens

- Primary key on `id`
- Foreign key to `users.id`
- Index on `user_id`

### URLs

- Primary key on `id`
- Unique index on `short_code`
- Foreign key to `users.id`
- Index on `user_id`

The `short_code` index is important because redirect requests perform lookups using the short code.

### Analytics

- Primary key on `id`
- Foreign key to `urls.id`
- Index on `url_id`
- Indexing strategy for analytics queries should support filtering by URL and time.

---

## 5. Data Relationships

```text
User
 ├── has many Refresh Tokens
 └── has many URLs

URL
 └── has many Analytics Events
```

UTM parameters belong to the URL configuration and are used when constructing the destination URL during redirection.

---

## 6. ID & Short Code

The URL record has an internal database ID and a separate public `short_code`.

High-level generation:

```text
Unique ID
   │
   ▼
Base62 Encoding
   │
   ▼
Short Code
```

The internal ID is not exposed as the public short URL identifier.

The exact PostgreSQL ID strategy and Drizzle column definitions are documented in the project's technical/database schema implementation.

---

## 7. Timestamp & Data Rules

- Store timestamps consistently using UTC.
- Passwords are stored only as password hashes.
- Refresh tokens are stored as hashes.
- `short_code` must be unique.
- Foreign keys maintain relationships between users, URLs, refresh tokens, and analytics events.
- Expired URLs are identified using their expiration timestamp.
