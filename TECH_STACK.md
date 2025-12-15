# UpcharSaathi - Technical Stack Documentation

This document outlines the technologies, libraries, and frameworks used in the **UpcharSaathi** application, mapped to their specific features and implementations.

## 1. Core Framework & Architecture
| Technology | Usage |
|------------|-------|
| **Next.js 16** | Core React framework using the **App Router** architecture for routing, server components, and API routes. |
| **React 19** | UI library for building component-based interfaces. |
| **Node.js** | Runtime environment for server-side logic and API endpoints. |
| **Vercel** | (Implied) Hosting and deployment platform optimized for Next.js. |

## 2. UI & Styling
| Technology | Usage |
|------------|-------|
| **Bootstrap 5** | Core responsiveness and grid system (`react-bootstrap`). |
| **Custom CSS** | Heavily customized `globals.css` with a **Dark Healthcare Theme**, glassmorphism effects, and CSS variables. |
| **Framer Motion** | Advanced animations for page transitions, scrolling effects, and component interactions (`framer-motion`). |
| **Lucide React** | Consistent, modern icon set used throughout the application (`lucide-react`). |
| **Radix UI** | Accessible UI primitives (e.g., Tooltips) (`@radix-ui/react-tooltip`). |

## 3. Backend & Database
| Technology | Usage |
|------------|-------|
| **PostgreSQL** | Primary relational database for storing user data, health records, mood entries, etc. |
| **Prisma ORM** | Type-safe database client used for schema modeling (`schema.prisma`) and database queries (`@prisma/client`). |
| **Redis** | High-performance key-value store, used for session management and caching (`ioredis`). |

## 4. Authentication & Security
| Technology | Usage |
|------------|-------|
| **Stack Auth** | Managed authentication service handling signup, login, OAuth (Google/GitHub), and session management (`@stackframe/stack`). |
| **Zod** | Schema validation for API requests and form data (`zod`). |
| **Jose** | JWT operations and signing/verification (`jose`). |
| **Bcrypt.js** | Password hashing for custom implementation needs (`bcryptjs`). |

## 5. Feature-Specific Libraries

### 📍 Maps & Geolocation (Find Care)
-   **Leaflet / React-Leaflet**: Renders interactive maps for locating doctors and hospitals.
-   **@capacitor/geolocation**: Accesses native device GPS on mobile for "Near Me" functionality.

### 🧠 AI & Health Analysis (Health Scanner, Fact Check)
-   **Google Generative AI (Gemini)**: Powers the **Symptom Checker** and **Fact Check** analysis using the Gemini Pro model (`@google/generative-ai`).
-   **Tesseract.js**: OCR library for extracting text from uploaded medical reports (`tesseract.js`).

### 📰 News & Content (Health News, Fact Check)
-   **RSS Parser**: Fetches real-time health news from RSS feeds (`rss-parser`).
-   **Cheerio**: Scrapes web page metadata for fact-checking URLs (`cheerio`).
-   **YouTube Transcript**: Extracts transcripts from YouTube videos for video fact-checking (`youtube-transcript`).
-   **Fuse.js**: Fuzzy search capability for searching local health data or history (`fuse.js`).

### 📊 Visualization (Track Health, Mental Health)
-   **Recharts**: Renders interactive charts for heart rate monitoring, mood tracking trends, and activity data (`recharts`).

### 📱 Mobile Integration (PWA / Native)
-   **Capacitor**: Wraps the web app into a native mobile app for Android and iOS (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`).
-   **Capacitor Health Connect**: Integrates with Google Health Connect (Android) to sync fitness data like steps and heart rate (`capacitor-health-connect`).

### 💳 Payments
-   **Razorpay**: Payment gateway integration for handling transactions (simulated in test mode) (`app/api/payments`).

### 📧 Communication
-   **Nodemailer**: Handles email sending for contact forms and notifications (`nodemailer`).

## 6. Directory Structure Mapping

-   **`app/`**: Next.js App Router pages and API routes.
    -   `api/`: Backend endpoints (Prisma, AI, 3rd party APIs).
    -   `auth/`: Stack Auth integration pages.
-   **`components/`**: Reusable UI components (Navbar, Footer, Graphs, Cards).
-   **`utils/`**: Helper functions (AI analyzers, date formatters).
-   **`prisma/`**: Database schema and migration files.
-   **`public/`**: Static assets (images, icons).
