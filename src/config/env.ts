import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
  "PORT",
  "NODE_ENV",
  "CORS_ORIGINS",
  "APP_BASE_URL",
  "DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRES_IN",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USERNAME",
  "SMTP_PASSWORD",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "JUDGE0_API_URL",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  APP_BASE_URL: process.env.APP_BASE_URL,
  DATABASE_URL: process.env.DATABASE_URL as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  JUDGE0_API_URL: process.env.JUDGE0_API_URL as string,
};
