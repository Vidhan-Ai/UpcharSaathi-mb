# Mobile App Setup (Capacitor)

This project has been configured with Capacitor to run as a mobile app on Android and iOS.

## Prerequisites

- **Android**: Android Studio installed.
- **iOS**: Xcode installed (macOS only).

## Configuration

The mobile app is currently configured to wrap your existing Next.js application. Because your app uses server-side features (API routes, SSR), the mobile app must point to a running instance of your server.

1.  Open `capacitor.config.ts`.
2.  Uncomment the `server` section.
3.  Set `url` to your running server:
    *   **Development**: Use your local IP address (e.g., `http://192.168.1.5:3000`). Do NOT use `localhost` as it refers to the device itself.
    *   **Production**: Use your deployed URL (e.g., `https://upcharsaathi.com`).

```typescript
server: {
  url: 'http://192.168.1.5:3000', // Example
  cleartext: true, // Required for http (non-https)
  androidScheme: 'https'
}
```

## Running the App

1.  **Start the Server**:
    The mobile app requires the Next.js server to be running.
    ```bash
    npm run dev
    ```
    *Note: `npm run start` requires a successful build (`npm run build`), which might fail due to dependency compatibility issues (React 19 vs React Bootstrap). For development, `npm run dev` is recommended.*

2.  **Sync**: If you change the config or assets, run:
    ```bash
    npm run mobile:sync
    ```

3.  **Android**:
    ```bash
    npm run mobile:android
    ```
    This will open Android Studio. Wait for Gradle to sync, then click the "Run" (Play) button to launch the app on an emulator or connected device.

4.  **iOS** (Mac only):
    ```bash
    npm run mobile:ios
    ```
    This will open Xcode. Select your device/simulator and click "Run".

## Notes

- The `mobile-dist` folder contains a placeholder `index.html`. This is loaded briefly before the app redirects to your server URL.
- Ensure your Next.js server is running (`npm run dev` or `npm start`) and accessible from your mobile device (same Wi-Fi).
