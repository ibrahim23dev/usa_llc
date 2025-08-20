import dotenv from "dotenv";
import path from "path";
import z from "zod";
// cwd = current working directory (অর্থাৎ আমরা এখন যে পাইলে আছি এটা)
dotenv.config({ path: path.join(process.cwd(), ".env") }); // এখানে ২ টা জয়েন করে দিয়েছে

const envSchema = z.object({
  NODE_ENV: z.string(),

  PORT: z.string(),
  SOCKET_PORT: z.string(),
  LOGO_URL: z.string().optional(),
  PROJECT_NAME: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_USER_NAME: z.string().optional(),
  REDIS_PASSWORD: z.string(),
  REDIS_URL: z.string(),

  REDIS_HOST_QUEUE: z.string(),
  REDIS_PORT_QUEUE: z.string(),
  REDIS_USER_NAME_QUEUE: z.string().optional(),
  REDIS_PASSWORD_QUEUE: z.string(),
  REDIS_URL_QUEUE: z.string(),

  KAFKA_URL_LOCAL: z.string().optional(),
  KAFKA_URL_PRODUCTION: z.string().optional(),
  KAFKA_CLIENT_ID: z.string().optional(),

  LOKI_SERVER_URL_LOCAL: z.string().optional(),

  MAX_IMAGE_SIZE: z.string().optional(),
  MAX_PDF_SIZE: z.string().optional(),
  MAX_AUDIO_SIZE: z.string().optional(),
  MAX_VIDEO_SIZE: z.string().optional(),
  MAX_DOC_SIZE: z.string().optional(),
  MAX_OTHER_SIZE: z.string().optional(),

  BCRYPT_SALT_ROUNDS: z.string(),
  IMGBB_KEY: z.string().optional(),
  ENCRYPTION_SECRET: z.string(),
  RESET_PASSWORD_LINK: z.string().optional(),

  REAL_HOST_SERVER_SIDE: z.string().optional(),
  LOCALHOST_SERVER_SIDE: z.string().optional(),
  REAL_HOST_CLIENT_SIDE: z.string().optional(),
  LOCALHOST_CLIENT_SIDE: z.string().optional(),

  JWT_SECRET: z.string(),
  JWT_FORGET_PASSWORD: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),

  LOCAL_URL: z.string(),
  LIVE_URL: z.string(),

  NODEMAILER_AUTH_EMAIL: z.string(),
  NODEMAILER_AUTH_PASS: z.string(),
  DEFAULT_SENDER_EMAIL: z.string().optional(),

  AWS_USER_ACCESS_KEY: z.string(),
  AWS_USER_SECRET_KEY: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_S3_CLOUDFRONT_CDN: z.string(),
  AWS_S3_REGION: z.string().optional(),
  AWS_DEFAULT_REGION: z.string().optional(),

  AWS_SES_USER_NAME: z.string().optional(),
  AWS_SES_SMTP_USER_NAME: z.string().optional(),
  AWS_SMS_SMTP_PASSWORD: z.string().optional(),
  AWS_SES_HOST: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  API_RESPONSE_LANGUAGE: z.string(),
});

const env = envSchema.parse(process.env);

export default {
  env: env.NODE_ENV,

  port: env.PORT,
  socketPort: env.SOCKET_PORT,
  logo: env.LOGO_URL,
  projectName: env.PROJECT_NAME,

  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    userName: env.REDIS_USER_NAME,
    password: env.REDIS_PASSWORD,
    url: env.REDIS_URL,
    queue: {
      host: env.REDIS_HOST_QUEUE,
      port: env.REDIS_PORT_QUEUE,
      userName: env.REDIS_USER_NAME_QUEUE,
      password: env.REDIS_PASSWORD_QUEUE,
      url: env.REDIS_URL_QUEUE,
    },
  },
  kafka: {
    url:
      env.NODE_ENV === "development"
        ? env.KAFKA_URL_LOCAL
        : env.KAFKA_URL_PRODUCTION,
    clientId: env.KAFKA_CLIENT_ID,
  },
  serverMonitor: {
    lokiServer: env.LOKI_SERVER_URL_LOCAL,
  },
  cloudinary: {
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  },
  fileSize: {
    image: Number(env.MAX_IMAGE_SIZE) || 1024,
    pdf: Number(env.MAX_PDF_SIZE) || 1024,
    audio: Number(env.MAX_AUDIO_SIZE) || 1024,
    video: Number(env.MAX_VIDEO_SIZE) || 1024,
    doc: Number(env.MAX_DOC_SIZE) || 1024,
    other: Number(env.MAX_OTHER_SIZE) || 1024,
  },

  bycrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
  imgbb_key: env.IMGBB_KEY,
  crypto_key: env.ENCRYPTION_SECRET,
  resetlink: env.RESET_PASSWORD_LINK,
  server_side_url:
    env.NODE_ENV === "production"
      ? env.REAL_HOST_SERVER_SIDE
      : env.LOCALHOST_SERVER_SIDE,
  client_side_url:
    env.NODE_ENV === "production"
      ? env.REAL_HOST_CLIENT_SIDE
      : env.LOCALHOST_CLIENT_SIDE,
  jwt: {
    secret: env.JWT_SECRET,
    forgetPassword: env.JWT_FORGET_PASSWORD,
    refresh_secret: env.JWT_REFRESH_SECRET,
    expires_in: env.JWT_EXPIRES_IN,
    refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,
  },

  // stripe: {
  //   publishable_key:
  //     env.NODE_ENV === "development"
  //       ? env.STRIPE_PUBLISHABLE_KEY_TEST
  //       : env.STRIPE_PUBLISHABLE_KEY_PRODUCTION,
  //   secret_key:
  //     env.NODE_ENV === "development"
  //       ? env.STRIPE_SECRET_KEY_TEST
  //       : env.STRIPE_SECRET_KEY_PRODUCTION,
  // },
  // payment_url: {
  //   stripe_success_url:
  //     env.NODE_ENV === "development"
  //       ? `http://${env.LOCAL_URL}:${env.PORT}/${env.STRIPE_SUCCESS_URL}`
  //       : `https://${env.LIVE_URL}/${env.STRIPE_SUCCESS_URL}`,
  //   stripe_cancel_url:
  //     env.NODE_ENV === "development"
  //       ? `http://${env.LOCAL_URL}:${env.PORT}/${env.STRIPE_CANCEL_URL}`
  //       : `https://${env.LIVE_URL}/${env.STRIPE_CANCEL_URL}`,
  //   paypal_success_url:
  //     env.NODE_ENV === "development"
  //       ? `http://${env.LOCAL_URL}:${env.PORT}/${env.PAYPAL_SUCCESS_URL}`
  //       : `https://${env.LIVE_URL}/${env.PAYPAL_SUCCESS_URL}`,
  //   paypal_cancel_url:
  //     env.NODE_ENV === "development"
  //       ? `http://${env.LOCAL_URL}:${env.PORT}/${env.PAYPAL_CANCEL_URL}`
  //       : `https://${env.LIVE_URL}/${env.PAYPAL_CANCEL_URL}`,
  // },
  // paypal: {
  //   client:
  //     env.NODE_ENV === "development"
  //       ? env.PAYPAL_CLIENT_ID
  //       : env.PAYPAL_CLIENT_ID_LIVE,
  //   secret:
  //     env.NODE_ENV === "development"
  //       ? env.PAYPAL_SECRET_KEY
  //       : env.PAYPAL_SECRET_KEY_LIVE,
  //   mode:
  //     env.NODE_ENV === "development" ? env.PAYPAL_MODE : env.PAYPAL_MODE_LIVE,
  // },
  nodemailer: {
    auth_user: env.NODEMAILER_AUTH_EMAIL,
    auth_pass: env.NODEMAILER_AUTH_PASS,
    default_sender_email: env.NODEMAILER_AUTH_EMAIL,
  },
  aws: {
    s3: {
      accessKeyId: env.AWS_USER_ACCESS_KEY,
      secretAccessKey: env.AWS_USER_SECRET_KEY,
      region: env.AWS_S3_REGION || env.AWS_DEFAULT_REGION || "ap-south-1",
      bucket: env.AWS_S3_BUCKET_NAME,
      cloudfrontCDN: env.AWS_S3_CLOUDFRONT_CDN,
    },
    ses: {
      userName: env.AWS_SES_USER_NAME,
      smptUserName: env.AWS_SES_SMTP_USER_NAME,
      smptPassword: env.AWS_SMS_SMTP_PASSWORD,
      host: env.AWS_SES_HOST,
      default_sender_email: env.DEFAULT_SENDER_EMAIL,
    },
  },
  api_response_language: env.API_RESPONSE_LANGUAGE,
};
