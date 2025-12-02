# UpcharSaathi

A comprehensive healthcare dashboard providing a single point of access for various healthcare needs, including finding doctors, blood banks, first aid information, and managing personal health records.

## 🚀 Features

*   **Find Doctors**: Locate healthcare providers nearby with advanced filtering and map integration.
*   **Blood Bank**: Find blood banks and check availability (mock data).
*   **First Aid Guide**: Quick access to essential first aid procedures.
*   **User Profile**: Manage medical records, appointments, and settings.
*   **Authentication**: Secure login and signup with email verification.
*   **Responsive Design**: Fully responsive UI built with React Bootstrap.
*   **Theme**: Modern Light Red theme with consistent styling.

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **UI Library**: React Bootstrap (Bootstrap 5)
*   **Icons**: Lucide React
*   **Database**: PostgreSQL (via Prisma ORM)
*   **Caching/Session**: Redis (ioredis)
*   **Maps**: Leaflet (react-leaflet) with OpenStreetMap & Nominatim
*   **Authentication**: Custom JWT-based auth
*   **Email**: Nodemailer

## ⚡ Performance Optimizations

*   **Dependencies**: Reduced unused packages by ~70%.
*   **Build**: Optimized Next.js build configuration (compression, image optimization).
*   **Caching**: Implemented Redis caching for API responses and session management.
*   **Code Splitting**: Automatic code splitting via Next.js.

## 📦 Production Setup

### Prerequisites
*   Docker & Docker Compose
*   Node.js 18+

### Quick Start (Docker)

1.  **Start Services**:
    ```bash
    docker-compose up -d
    ```
    This starts PostgreSQL (5432), Redis (6379), and the App (3000).

2.  **Environment Variables**:
    Create a `.env` file with the following:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@postgres:5432/upcharsaathi?schema=public"
    REDIS_URL="redis://redis:6379"
    JWT_SECRET="your-secret"
    JWT_REFRESH_SECRET="your-refresh-secret"
    SMTP_HOST="smtp.example.com"
    SMTP_USER="user"
    SMTP_PASS="pass"
    ```

3.  **Database Migration**:
    ```bash
    docker-compose exec app npx prisma migrate deploy
    ```

### Manual Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## 📜 Migration History

### Bootstrap Migration
The project was migrated from Tailwind CSS to **Bootstrap 5** to ensure consistent styling and leverage React Bootstrap components.

### PostgreSQL Migration
Database was migrated from MySQL to **PostgreSQL** to support advanced features and better performance.
*   Uses `pgcrypto` for UUID generation.
*   Schema updated to support `CachedProvider` for map data caching.

### Red Theme Overhaul
The application underwent a complete design overhaul to a **Light Red** theme (`#dc2626` primary, `#fb7185` secondary) to provide a warm, professional medical aesthetic.

## 🗺️ Maps & Navigation
*   **Provider**: OpenStreetMap (via Leaflet)
*   **Geocoding**: Nominatim API
*   **Data Source**: Overpass API (cached in Postgres)
*   **Navigation**: Smart deep-linking to Google Maps (Web/Android) and Apple Maps (iOS).

## 🤝 Contributing
1.  Fork the repository
2.  Create a feature branch
3.  Commit your changes
4.  Push to the branch
5.  Open a Pull Request
