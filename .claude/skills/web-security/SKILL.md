---
name: web-security
description: Enforce web security and avoid security vulnerabilities. Use when handling user input, managing authentication/sessions, or other security-related tasks.
---

# Web Security

We treat **web security as a core requirement**, not an afterthought.
Assume hostile input and untrusted environments by default.

## Core Principles

- **NEVER** trust user input
- **ALWAYS** validate and sanitize data at boundaries
- Prefer secure defaults over configurability

## XSS & Injection

- **AVOID** `dangerouslySetInnerHTML` and raw HTML injection
- Escape and encode dynamic content properly
- Never interpolate untrusted data into HTML, CSS, or JS contexts
- Ensure SQL injection protection — Drizzle ORM uses parameterized queries by default;
  never construct raw SQL strings with user input

## Authentication & Authorization

- Do not store secrets or tokens in insecure locations
- **AVOID** localStorage for sensitive credentials
- Use HTTP-only, secure cookies for Auth.js sessions — this is the default Auth.js v5
  behavior and must not be changed
- Always enforce authorization on the server — every API route that reads or writes
  bookmark data must verify the session before processing

## Metadata Fetch Security

The `POST /api/metadata` route fetches external URLs server-side. Apply these rules:

- Validate and sanitize the incoming URL before fetching (must be a valid `https://` URL)
- Do not follow redirects to private/internal IP ranges (SSRF prevention)
- Set a short fetch timeout to prevent hanging requests
- Never return raw HTML to the client — return only the extracted structured data
- Treat all externally fetched content (title, description) as untrusted; it will be
  displayed in the UI and must be treated as potentially hostile input

## Cloudinary Upload Security

- Never expose Cloudinary API secrets to the client
- All uploads must be server-mediated: client sends file to your API route, API route
  uploads to Cloudinary using server-side credentials, returns the resulting URL
- Use signed uploads with restricted presets — do not use unsigned upload presets

## Browser Security APIs

- Respect CORS, CSP, and browser security boundaries
- Use Content Security Policy to restrict script and resource execution
- Avoid inline scripts and styles when CSP is enabled

## Browser Extension Token Storage (Phase 3)

The browser extension stores an auth token to make authenticated API calls.

- Store the session token in `chrome.storage.local` — it is sandboxed to the extension
  and not accessible to web pages
- **Do not** store tokens in `localStorage`, `sessionStorage`, or cookies from the
  extension context — these do not provide the same isolation
- The token must be sent as a header on API calls, not embedded in URLs
- The extension must not expose the token to content scripts or the page DOM
- On logout from the main app, the extension token must also be cleared

## Data Handling

- Minimize data exposure — API responses should return only the fields the client needs
- Do not log sensitive information (tokens, passwords, full user records)

## Dependencies & Supply Chain

- Avoid unnecessary packages
- Treat third-party code as untrusted input

## General Principles

- Simplicity reduces attack surface
- If unsure, choose the more restrictive option
