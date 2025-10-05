import 'dotenv/config';

export default {
  expo: {
    name: "IdeaSpark",
    slug: "ideaspark",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#667eea"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ideaspark.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.ideaspark.mobile"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    extra: {
      CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
      eas: {
        projectId: "your-project-id-here"
      }
    }
  }
};