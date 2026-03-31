# HellBillingRB — Technical Specification

## 1. Project Overview

**HellBillingRB** is a web application for creating and managing roadbooks that describe car journeys. Users create **trips**, each consisting of ordered **lines** (waypoints). The application provides route visualization on maps, PDF export for printing, and role-based access control.

### 1.1 Core Concepts

| Concept | Description |
|---|---|
| **Trip** | A named car journey containing an ordered sequence of lines |
| **Line** | A single waypoint/point on a trip route |
| **Roadbook** | The printable/viewable output describing the full trip route |
| **Tulip** | A directional turn diagram image associated with a line |

---

## 2. User Roles & Authentication

### 2.1 Authentication

- Users authenticate via **email and password**
- User accounts are created exclusively by administrators (no self-registration)
- Authentication is handled by **Firebase Authentication**
- Role is stored as a **custom claim** on the Firebase Auth ID token
- Session persists via localStorage with a **24-hour auto-logout** timer
- The introductory/landing page is the only publicly accessible page

### 2.2 Roles

| Role | Description |
|---|---|
| **user** | Read-only access to trips; can view and navigate roadbooks |
| **editor** | Can create, edit, and manage trips and lines |
| **admin** | Full access — includes user management (create, edit, delete users) |

### 2.3 Role Permissions Matrix

| Action | user | editor | admin |
|---|---|---|---|
| View trip list | own trips | own trips | all trips |
| View trip detail | yes | yes | yes |
| Create trip | yes | yes | yes |
| Edit trip | yes | yes | yes |
| Delete trip | yes | yes | yes |
| Create/edit/delete lines | yes | yes | yes |
| Reorder lines (drag & drop) | yes | yes | yes |
| Export trip to PDF | yes | yes | yes |
| Mark line as passed | yes | yes | yes |
| Manage all trips | no | no | yes |
| View user list | no | no | yes |
| Create/edit/delete users | no | no | yes |

---

## 3. Data Model

### 3.1 Firestore Collections

```
users/{userId}
trips/{tripId}
trips/{tripId}/lines/{lineId}
```

### 3.2 User Document

| Field | Type | Description |
|---|---|---|
| `userId` | string | Unique identifier (matches Firebase Auth UID) |
| `name` | string | Display name |
| `email` | string | Email address (used for login) |
| `description` | string | Optional user description |

Role is stored as a **custom claim** on the Firebase Auth token, not in the Firestore document.

### 3.3 Trip Document

| Field | Type | Description |
|---|---|---|
| `tripId` | string | Unique identifier |
| `name` | string | Trip name |
| `userId` | string | Owner's user ID |
| `imageName` | string | Optional reference to trip cover image in Firebase Storage |
| `linesCount` | number | Auto-calculated count of lines (maintained by Cloud Function triggers) |

### 3.4 Line Document

| Field | Type | Required | Description |
|---|---|---|---|
| `lineId` | string | yes | Unique identifier |
| `tripId` | string | yes | Parent trip reference |
| `order` | number | yes | Sort position within the trip |
| `name` | string | yes | Name/description of the waypoint |
| `lat` | number | no | Latitude coordinate |
| `lng` | number | no | Longitude coordinate |
| `kmTotal` | number | no | Cumulative distance from route start (km) |
| `kmPart` | number | calculated | Distance from previous line (auto-calculated) |
| `tulip` | string | no | Reference to tulip direction image |
| `mapPage` | number | no | Page number on an external printed map |
| `roadNo` | string | no | Road number continuing from this point |
| `interest` | array | no | Points of interest tags: `"culture"`, `"sport"`, `"history"` |
| `stop` | boolean | no | Recommended stop flag |
| `note` | string | no | Free-text note for route description |
| `passed` | boolean | no | Flag indicating the waypoint has been passed |
| `close` | boolean | calculated | `true` if distance to next line is < 2 km |

### 3.5 Calculated Fields

- **`kmPart`** — Derived as the difference between the current line's `kmTotal` and the previous line's `kmTotal`
- **`close`** — Derived by comparing distance to the next line against a configurable threshold (default: 2 km, defined in `src/config/settings.js`)
- **`linesCount`** on Trip — Maintained by Firestore triggers (`incrementLineCounter` / `decrementLineCounter`) that fire on line document creation/deletion

---

## 4. Application Architecture

### 4.1 Frontend (SPA)

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build tool | Vite |
| Routing | vue-router 4 (client-side, lazy-loaded routes) |
| State management | Pinia (setup-style stores) |
| UI library | Quasar |
| Maps | vue3-google-map (Google Maps JavaScript API, Advanced Markers) |
| PDF export | jsPDF + jspdf-autotable, html2pdf.js, pdfMake |
| Drag & drop | vue-draggable-plus |
| Language | JavaScript (ES Modules, no TypeScript) |

### 4.2 Backend (Serverless)

| Layer | Technology |
|---|---|
| Platform | Firebase (Google Cloud) |
| Functions | Firebase Cloud Functions v2 (Node 24, CommonJS) |
| Database | Cloud Firestore |
| Auth | Firebase Authentication |
| File storage | Firebase Storage |
| Hosting | Firebase Hosting (SPA rewrite) |
| App security | Firebase App Check (reCAPTCHA Enterprise) |

### 4.3 Pinia Stores

| Store | Responsibility |
|---|---|
| `auth` | Authentication state, login/logout, role checks, auto-logout timer |
| `trips` | CRUD operations for trips, trip listing |
| `lines` | CRUD operations for lines, ordering, batch operations |
| `users` | CRUD operations for user accounts (admin only) |

---

## 5. Pages & Routes

### 5.1 Route Definitions

| Route | Page | Auth | Role | Description |
|---|---|---|---|---|
| `/` | Index | no | — | Public landing page |
| `/auth` | UserAuth | unauth only | — | Login page (redirects if already logged in) |
| `/trips` | TripList | yes | all | List of trips |
| `/trips/create` | TripCreate | yes | editor+ | Create new trip |
| `/trips/:id/edit` | TripEdit | yes | editor+ | Edit trip + manage lines |
| `/trips/:id` | TripView | yes | all | View trip detail |
| `/trips/:id/tcr` | TripViewTCR | yes | all | Alternative trip view (TCR format) |
| `/trips/:id/print` | TripViewPrint | yes | all | Print-friendly view with PDF export |
| `/users` | UserList | yes | admin | List all users |
| `/users/create` | UserCreate | yes | admin | Create new user |
| `/users/:id/edit` | UserEdit | yes | admin | Edit user |
| `/:catchAll(.*)` | NotFound | no | — | 404 page |

### 5.2 Navigation Guards

- **`meta.requiresAuth`** — Redirects unauthenticated users to `/auth`
- **`meta.requiresUnauth`** — Redirects authenticated users to `/`
- Role-based restrictions enforced at the component level

---

## 6. Cloud Functions (API)

All backend operations use Firebase **onCall** (HTTPS Callable) functions or Firestore triggers. There is no REST API.

### 6.1 User Management Functions

| Function | Type | Input | Description |
|---|---|---|---|
| `createUser` | onCall | `{ user: { name, email, password, role, description } }` | Creates Firebase Auth user, sets role custom claim, creates Firestore user doc |
| `updateUser` | onCall | `{ user: { userId, name, email, role, description } }` | Updates user data in Auth and Firestore |
| `deleteUser` | onCall | `{ userId }` | Deletes user from Auth and Firestore |
| `getUserRole` | onCall | `{ email }` | Returns the role custom claim for the given user |

### 6.2 Firestore Triggers

| Function | Trigger | Description |
|---|---|---|
| `incrementLineCounter` | `onDocumentCreated` on `trips/{tripId}/lines/{lineId}` | Increments `linesCount` on parent trip |
| `decrementLineCounter` | `onDocumentDeleted` on `trips/{tripId}/lines/{lineId}` | Decrements `linesCount` on parent trip |

### 6.3 Utility Functions

| Function | Type | Description |
|---|---|---|
| `helloWorld` | onCall | Health check / service verification |
| `firstUserRole` | onCall | Bootstrap: assigns admin role to the first user |

---

## 7. Security

### 7.1 Firebase App Check

- Enabled with **reCAPTCHA Enterprise** provider
- Debug token support for local development
- Protects Cloud Functions and Firestore from unauthorized access

### 7.2 Firestore Security Rules

```
users/{userId}        — read/write: authenticated users with admin role only
trips/{tripId}        — read/write: any authenticated user
trips/{tripId}/lines  — read/write: any authenticated user
```

### 7.3 Storage Security Rules

```
read:  public (anyone can read/download files)
write: authenticated users only
```

### 7.4 Authentication Security

- No self-registration — accounts created by admin only
- Role assigned via custom claims (not editable by client)
- 24-hour session expiry with automatic logout
- Auth state persisted in localStorage

---

## 8. Google Maps Integration

### 8.1 Features

- Interactive map display with **Advanced Markers**
- Markers rendered from trip line coordinates (`lat`, `lng`)
- **Map dialog** for selecting/placing waypoint locations when creating or editing lines
- Click-to-place marker for coordinate input
- Separate API keys for production and localhost environments

### 8.2 Configuration

- Google Maps API key and Map ID injected via environment variables (`VITE_*`)
- Configured as Vue global properties for app-wide access

---

## 9. PDF Export

### 9.1 Capabilities

- Generate printable roadbook PDF from trip data
- Table-based layout using **jsPDF** + **jspdf-autotable**
- HTML-to-PDF rendering via **html2pdf.js** for complex layouts
- Declarative PDF generation via **pdfMake** (used in `usePdfExport` composable)
- Custom embedded fonts: **Montserrat Bold** and **Montserrat Regular**

### 9.2 Print View

- Dedicated `/trips/:id/print` route with print-optimized layout
- Includes all line data: waypoint name, km, tulip, road number, interests, notes

---

## 10. Line Input Methods

Lines (waypoints) can be created in two ways:

1. **Manual form entry** — User fills in all fields (name, coordinates, km, etc.) via the line form
2. **Google Maps selection** — User opens the map dialog, clicks a location on the map, which automatically populates `lat` and `lng` for the line

---

## 11. Key UI Features

### 11.1 Trip Editing

- Inline line management within the trip edit page
- **Drag-and-drop reordering** of lines (via vue-draggable-plus)
- Line `order` field updated in batch after reorder
- Trip cover image upload to Firebase Storage

### 11.2 Line Display

- Two view variants: **standard** (TripView) and **TCR** (TripViewTCR)
- Interest icons/badges for culture, sport, history
- `close` indicator when next waypoint is nearby (< 2 km)
- `passed` checkbox for tracking journey progress
- `stop` recommendation indicator

### 11.3 Responsive Layout

- Quasar component library provides responsive grid and components
- Side navigation drawer (TheDrawer) with role-based menu items
- Header bar with app navigation and user info
- Footer with app information

---

## 12. Environment Configuration

All secrets and API keys are managed via Vite environment variables (`.env.local`):

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key (production) |
| `VITE_GOOGLE_MAPS_API_KEY_LOCALHOST` | Google Maps API key (local dev) |
| `VITE_GOOGLE_MAPS_MAP_ID` | Google Maps Map ID (for Advanced Markers) |
| `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` | reCAPTCHA Enterprise site key |

---

## 13. Development & Deployment

### 13.1 Local Development

```bash
npm run dev                # Start Vite dev server (port 5175)
npm run fb-emul            # Start Firebase Emulator Suite with seed data
```

**Emulator Ports:**

| Service | Port |
|---|---|
| Auth | 9100 |
| Firestore | 8081 |
| Functions | 5002 |
| Storage | 9200 |
| Emulator UI | 4001 |

The frontend auto-detects running emulators by pinging `http://localhost:4001/emulator/v1/projects` at startup.

### 13.2 Production Deployment

```bash
npm run build              # Build frontend (output: dist/)
firebase deploy            # Deploy hosting + Cloud Functions
```

- **Hosting**: Firebase Hosting serves the `dist/` folder with SPA rewrite (all routes to `index.html`)
- **Functions**: Deployed to Firebase Cloud Functions (Node 24 runtime)

### 13.3 Seed Data

- Emulator seed data stored in `hb_emulator_data/hb_current`
- Includes Auth users, Firestore documents, and Storage files
- Imported automatically with `npm run fb-emul`
