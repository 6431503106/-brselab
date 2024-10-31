import dotenv from 'dotenv';
/* CONFIGURE ENV VARIABLES */

dotenv.config();
const PORT = process.env.PORT ;
const NODE_ENV = process.env.NODE_ENV ;
const MONGODB_URI = process.env.MONGODB_URI ;
const JWT_SECRET = process.env.JWT_SECRET ;
const SESSION_SECRET = process.env.SESSION_SECRET ;
const CLIENT_URL = process.env.CLIENT_URL ;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME ;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD ;
const SMTP_HOST = process.env.SMTP_HOST ;
const SMTP_PORT = process.env.SMTP_PORT ;
const MAIL_USER = process.env.MAIL_USER ;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD ;
const ADMIN_MAIL = process.env.ADMIN_MAIL ;

export {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    SESSION_SECRET,
    CLIENT_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
    SMTP_HOST, SMTP_PORT, MAIL_USER, MAIL_PASSWORD,
    ADMIN_MAIL,
};