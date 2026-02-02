import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL, 

  trustedOrigins: [process.env.APP_URL!],

  advanced: {
    defaultCookieAttributes: {
       secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    },
  },


  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Medi Store" <osmangoniyou12@gmail.com>',
          to: user.email,
          subject: "Please verify your email!",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background-color: #0f172a; color: #ffffff; padding: 20px; text-align: center; }
    .content { padding: 30px; color: #334155; line-height: 1.6; }
    .verify-button { background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; }
    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 13px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Medi Store</h1></div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hello ${user.name}, please confirm your email address.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" class="verify-button">Verify Email</a>
      </div>
      <p>Or verify using this link: <br/> ${url}</p>
    </div>
    <div class="footer">© 2025 Medi Store. All rights reserved.</div>
  </div>
</body>
</html>`,
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});