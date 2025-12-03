import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.upcharsaathi.app',
  appName: 'UpcharSaathi',
  webDir: 'mobile-dist',
  server: {
    url: 'https://usmb.vercel.app',
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;
