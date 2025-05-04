// import { getEnv } from "../utils/get-env";

// const appConfig = () => ({
//   NODE_ENV: getEnv("NODE_ENV", "development"),
//   PORT: getEnv("PORT", "5000"),
//   BASE_PATH: getEnv("BASE_PATH", "/api"),
//   MONGO_URI: getEnv("MONGO_URI"),

//   SESSION_SECRET: getEnv("SESSION_SECRET"),
//   SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),

//   GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
//   GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
//   GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

//   FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
//   FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
// });

// export const config = appConfig();
import { getEnv } from "../utils/get-env";

const appConfig = () => {
  const config = {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "5000"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI", "mongodb+srv://businessspaces2:WDHiQHmy4c99dYAv@cluster0.uezznwz.mongodb.net/crm_db"),

    SESSION_SECRET: getEnv("SESSION_SECRET"),
    SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),

    validate() {
      const requiredKeys = [
        "MONGO_URI",
        "SESSION_SECRET",
        "SESSION_EXPIRES_IN",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_GOOGLE_CALLBACK_URL",
      ];

      for (const key of requiredKeys) {
        if (!config[key as keyof typeof config]) {
          throw new Error(`Missing required env variable: ${key}`);
        }
      }
    },
  };

  return config;
};

export const config = appConfig();
