# URL Shortener & Analytics Platform

A URL shortening platform that allows users to create and manage short URLs with UTM tracking parameters and provides analytics on link performance.

## 1. Project Overview

The platform allows registered users to:

- Register and log in using email/password.
- Authenticate API requests using JWT-based access tokens.
- Maintain sessions using refresh tokens.
- Create short URLs from long/original URLs.
- Add UTM tracking parameters while creating a short URL.
- Redirect visitors from short URLs to the configured destination.
- Track visitor activity during redirects.
- View link performance through an analytics dashboard.

The system is designed as a backend-driven application where authentication, URL generation, redirection, and analytics are handled through APIs.

---

## 2. Core Features

### 2.1 User Authentication

Users can create an account and authenticate using:

- Email and password registration.
- Email and password login.
- Secure password hashing using a modern, industry-standard password hashing algorithm.
- JWT access tokens for authenticated API requests.
- Random, securely generated refresh tokens for maintaining sessions.
- Access-token refresh using refresh tokens.
- Logout/session revocation through refresh-token management.

Passwords are never stored in plaintext.

---

### 2.2 Short URL Generation

Authenticated users can create short URLs by providing:

- Original/main URL.
- Optional UTM parameters.

Supported UTM parameters include:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

The system generates a unique short code and associates it with the destination URL and its tracking configuration.

Example:

```text
Original URL:
https://example.com/products

Tracking:
utm_source=google
utm_medium=cpc
utm_campaign=summer-sale

Generated URL:
https://short.example/Ab12Cd
```

When a visitor accesses the short URL, the system redirects them to the appropriate destination URL with the configured tracking parameters.

---

## 3. Analytics

The platform collects analytics when a short URL is accessed.

### 3.1 Overview Analytics

The dashboard provides high-level metrics such as:

- Total clicks.
- Click trends over time.
- Performance of individual short URLs.
- UTM-based traffic distribution.

### 3.2 Visitor Analytics

Analytics can be grouped and displayed based on:

**Technology**

- Browser
- Operating system
- Device type

**UTM Parameters**

- Source
- Medium
- Campaign
- Content
- Term

**Geography**

- Country
- City
- Region
- Continent

The dashboard can provide charts and tabular views to allow users to understand where traffic is coming from and how visitors interact with their links.

---

## 4. Redirect & Analytics Flow

When a visitor opens a short URL:

```text
Visitor
   │
   ▼
Short URL
   │
   ▼
Find short URL configuration
   │
   ├── Validate URL/status
   │
   ▼
Collect request information
   │
   ├── Browser
   ├── OS
   ├── Device
   └── IP/Geographic information
   │
   ▼
Record analytics event
   │
   ▼
Build destination URL
   │
   ├── Original URL
   └── UTM parameters
   │
   ▼
HTTP Redirect
   │
   ▼
Destination Website
```

Analytics processing should be designed so that collecting analytics does not unnecessarily delay the redirect response.

---

## 5. Main System Components

The project can be divided into the following logical components:

### Authentication

Responsible for:

- User registration.
- Login.
- Password hashing and verification.
- Access-token generation and validation.
- Refresh-token management.
- Logout/session revocation.

### URL Management

Responsible for:

- Short URL creation.
- Short-code generation.
- URL retrieval.
- URL ownership.
- UTM configuration.
- URL lifecycle/status management.

### Redirect Handling

Responsible for:

- Resolving short codes.
- Validating the destination URL.
- Recording the click/analytics event.
- Applying configured UTM parameters.
- Redirecting the visitor.

### Analytics

Responsible for:

- Recording click events.
- Processing visitor/request information.
- Storing geographic information.
- Aggregating analytics.
- Providing dashboard data.

### Dashboard

Responsible for presenting:

- Click charts.
- Technology breakdown.
- UTM breakdown.
- Geographic breakdown.
- URL performance.

---

## 6. High-Level Data Flow

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Authentication  │
                  └────────┬────────┘
                           │
                    Access Token
                           │
                           ▼
                  ┌─────────────────┐
                  │  URL Management │
                  └────────┬────────┘
                           │
                    Short URL
                           │
                           ▼
                    ┌────────────┐
                    │  Visitor   │
                    └─────┬──────┘
                          │
                          ▼
                  ┌─────────────────┐
                  │ Redirect Handler│
                  └───────┬─────────┘
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
      ┌──────────────┐         ┌──────────────┐
      │  Analytics   │         │   Redirect   │
      │    Event     │         │  Destination │
      └──────────────┘         └──────────────┘
```

---

## 7. Security Requirements

The application should follow standard security practices, including:

- Never storing plaintext passwords.
- Using a modern password hashing algorithm with an appropriate work factor.
- Short-lived JWT access tokens.
- Cryptographically secure random refresh tokens.
- Secure refresh-token storage and rotation/revocation where applicable.
- Authentication and authorization checks on protected APIs.
- Input validation for URLs and UTM parameters.
- Protection against malformed or malicious redirect URLs.
- Rate limiting for authentication and URL-generation endpoints.
- Avoiding unnecessary exposure of visitor IP information.
- Appropriate CORS and cookie/security-header configuration where applicable.
