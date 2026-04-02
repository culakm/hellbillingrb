# HellBillingRB — Technology Stack

## Runtime & Language

| Layer | Technology |
|---|---|
| Language | JavaScript (ES Modules, no TypeScript) |
| Node.js (Cloud Functions) | Node 24 |
| Module system (frontend) | `"type": "module"` (native ESM) |

---

## Frontend

### Core Framework
- **Vue 3** (`^3.4.21`) — Composition API (`<script setup>`), `ref`, `computed`, `defineProps`, `defineEmits`, `onMounted`, `onUnmounted`, `getCurrentInstance`
- **vue-router 4** (`^4.3.0`) — `createWebHistory`, navigation guards (`router.beforeEach`) for auth-protected and unauth-only routes, lazy-loaded routes via dynamic `import()`

### State Management
- **Pinia** (`^3.0.3`) — Setup-style stores (`defineStore` with Composition API). Four stores: `auth`, `trips`, `lines`, `users`

### UI Component Library
- **Quasar** (`^2.19.2`) — Components: `q-card`, `q-bar`, `q-btn`, `q-card-section`, `q-space`; Quasar plugins: `Loading`, `Dialog`, `AppFullscreen`; directives: `v-touch-pan`; Material Icons via `@quasar/extras`
- Sass theming via `quasar-variables.sass`

### Maps
- **vue3-google-map** (`^0.27.0`) — `GoogleMap`, `AdvancedMarker` components; Google Maps API key and Map ID injected via `app.config.globalProperties`
- Google Maps API is consumed via two separate keys (production / localhost)

### PDF Generation
- **jsPDF** (`^3.0.1`) — programmatic PDF creation
- **jspdf-autotable** (`^5.0.2`) — table plugin for jsPDF
- **html2pdf.js** (`^0.10.3`) — HTML-to-PDF rendering (canvas-based)
- **pdfMake** (`^0.3.7`) — alternative declarative PDF generation library (used in `src/composables/usePdfExport.js`)
- **html-to-pdfmake** (`^2.5.16`) — converts HTML strings to pdfMake document definition format
- Custom embedded fonts: `Montserrat-Bold`, `Montserrat-Regular` (pre-encoded JS files in `src/assets/fonts/`)

### Drag & Drop
- **vue-draggable-plus** (`^0.6.1`) — sortable list support (line reordering)

### Dev Tooling
- **Vite** (`^7.3.0`) — build tool, dev server on port `5175`
- **@vitejs/plugin-vue** (`^6.0.3`) — Vue SFC support
- **@quasar/vite-plugin** (`^1.10.0`) — Quasar integration for Vite
- **vite-plugin-vue-devtools** (`^8.0.5`) — devtools overlay
- **sass-embedded** (`^1.97.0`) — Sass compiler

### Path Aliases
- `@` → `./src` (configured in `vite.config.js` via `resolve.alias`)

---

## Backend — Firebase Cloud Functions

- **firebase-functions v2** (`^7.2.2`) — Gen 2 functions
  - `onCall` (HTTPS Callable) — `functions/v2/https`
  - `onDocumentCreated`, `onDocumentDeleted` — `functions/v2/firestore` Firestore triggers
- **firebase-admin** (`^13.6.0`) — server-side Admin SDK (user management, custom claims)
- Runtime: **Node 24**, CommonJS (`require`)

### Exported Cloud Functions
| Function | Type | Purpose |
|---|---|---|
| `createUser` | `onCall` | Create Firebase Auth user + Firestore record |
| `updateUser` | `onCall` | Update user data |
| `deleteUser` | `onCall` | Delete user from Auth + Firestore |
| `getUserRole` | `onCall` | Read custom claim `role` from ID token |
| `incrementLineCounter` | Firestore trigger | Increments line count on trip when a line doc is created |
| `decrementLineCounter` | Firestore trigger | Decrements line count on trip when a line doc is deleted |
| `helloWorld` | `onCall` | Service health check |
| `firstUserRole` | `onCall` | Bootstrap first admin role |

---

## Firebase Platform & Services

### Firebase SDK (client, `^12.6.0`)
| Service | SDK Module | Usage |
|---|---|---|
| **App** | `firebase/app` | `initializeApp` with env-var config |
| **App Check** | `firebase/app-check` | `initializeAppCheck` + `ReCaptchaEnterpriseProvider`; debug token support in dev |
| **Authentication** | `firebase/auth` | `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`, `getIdTokenResult` (custom claims: `role`) |
| **Firestore** | `firebase/firestore` | `collection`, `doc`, `getDoc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `writeBatch` |
| **Storage** | `firebase/storage` | `ref`, `uploadBytesResumable`, `getDownloadURL`, `deleteObject` |
| **Functions** | `firebase/functions` | `httpsCallable` |

### Firebase Hosting
- Public dir: `dist` (Vite build output)
- SPA rewrite: all routes → `index.html`

### Firestore Security Rules
- `users` collection — read/write: authenticated `admin` only
- `trips` and `trips/{tripId}/lines` — read/write: any authenticated user
- Custom claim `role` used for admin check → set via Cloud Functions / Admin SDK

### Storage Security Rules
- Read: public (`true`)
- Write: authenticated users only

### Firebase Emulator Suite
Emulators configured locally for development:

| Emulator | Port |
|---|---|
| Auth | 9100 |
| Firestore | 8081 |
| Functions | 5002 |
| Storage | 9200 |
| Emulator UI | 4001 |

Auto-detection: `firebase.js` pings `http://localhost:4001/emulator/v1/projects` at startup and connects all emulators if available.

---

## Google Cloud
- **Google Maps JavaScript API** — used via `vue3-google-map`; Map ID (Advanced Markers) and API key from environment variables
- **reCAPTCHA Enterprise** — used by Firebase App Check

---

## Project Architecture Patterns

- **Composition API + `<script setup>`** throughout all Vue components
- **Setup-style Pinia stores** (no Options/defineStore object syntax)
- **Composables** in `src/composables/` for Firebase Storage operations, form validation, and utilities
- **Lazy-loaded routes** — all page components loaded dynamically except `UserAuth`
- **Environment variables** via Vite `import.meta.env` (`VITE_*` prefix) for all secrets and API keys
- **No TypeScript** — plain JS with `jsconfig.json` for IDE path resolution
- **SPA deployment** with Firebase Hosting + client-side routing

---

## Data Model (Firestore)

```
users/{userId}
trips/{tripId}
trips/{tripId}/lines/{lineId}
```

---

## Emulator Data
Seed data snapshots stored in `hb_emulator_data/` (Auth, Firestore, Storage exports), importable with `npm run fb-emul`.
