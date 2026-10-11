import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "re_placeholder";
const fromEmail = process.env.EMAIL_FROM || "GlamBook <noreply@glambook.com>";

export const resend = new Resend(apiKey);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Core email sender with fallback simulation in dev when no real key is supplied
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!apiKey || apiKey.startsWith("re_placeholder")) {
    console.info(`[Email Service - Simulated] To: ${to} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Failed to send email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Email Verification Template
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string
) {
  const subject = "Verify your GlamBook account";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf1ef; padding: 24px; color: #1e1a19; }
          .card { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #fcdadb; }
          .logo { font-size: 24px; font-weight: bold; color: #eb7583; margin-bottom: 20px; }
          .button { display: inline-block; background-color: #eb7583; color: #ffffff !important; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
          .footer { font-size: 12px; color: #a09b9a; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">GlamBook</div>
          <h2>Welcome to GlamBook, ${name}!</h2>
          <p>Please click the button below to verify your email address and activate your account:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>If you did not sign up for GlamBook, you can safely ignore this email.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} GlamBook. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 2. Password Reset Template
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  const subject = "Reset your GlamBook password";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf1ef; padding: 24px; color: #1e1a19; }
          .card { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #fcdadb; }
          .logo { font-size: 24px; font-weight: bold; color: #eb7583; margin-bottom: 20px; }
          .button { display: inline-block; background-color: #eb7583; color: #ffffff !important; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
          .footer { font-size: 12px; color: #a09b9a; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">GlamBook</div>
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>This link is valid for 1 hour. If you didn't request a password reset, please ignore this email.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} GlamBook. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 3. Booking Confirmation / Notification Template
 */
export async function sendBookingNotificationEmail(
  to: string,
  recipientName: string,
  bookingNumber: string,
  details: {
    eventType?: string | null;
    bookingDate: string;
    bookingTime?: string | null;
    serviceName?: string | null;
  }
) {
  const subject = `Booking Update: ${bookingNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf1ef; padding: 24px; color: #1e1a19; }
          .card { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #fcdadb; }
          .logo { font-size: 24px; font-weight: bold; color: #eb7583; margin-bottom: 20px; }
          .badge { display: inline-block; background-color: #fcdadb; color: #1e1a19; padding: 4px 10px; border-radius: 8px; font-weight: bold; }
          .footer { font-size: 12px; color: #a09b9a; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">GlamBook</div>
          <h2>Booking Notification</h2>
          <p>Hello ${recipientName},</p>
          <p>Here are the latest details for booking <span class="badge">${bookingNumber}</span>:</p>
          <ul>
            <li><strong>Service:</strong> ${details.serviceName || "Standard Booking"}</li>
            <li><strong>Event:</strong> ${details.eventType || "Appointment"}</li>
            <li><strong>Date:</strong> ${details.bookingDate}</li>
            <li><strong>Time:</strong> ${details.bookingTime || "As agreed"}</li>
          </ul>
          <p>Log in to your GlamBook portal to manage or view full details.</p>
          <div class="footer">&copy; ${new Date().getFullYear()} GlamBook. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 4. Artist Profile Approved Email Template
 */
export async function sendArtistApprovalEmail(
  to: string,
  ownerName: string,
  businessName?: string | null
) {
  const subject = "Congratulations! Your GlamBook Artist Profile is Approved 🎉";
  const name = businessName || ownerName;
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/artist/login`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf1ef; padding: 24px; color: #1e1a19; }
          .card { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #fcdadb; }
          .logo { font-size: 24px; font-weight: bold; color: #eb7583; margin-bottom: 20px; }
          .btn { display: inline-block; background-color: #eb7583; color: #ffffff !important; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { font-size: 12px; color: #a09b9a; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">GlamBook</div>
          <h2>Welcome to GlamBook, ${name}!</h2>
          <p>Great news! Your artist profile has been reviewed and verified by our editorial administration team.</p>
          <p>Your listing is now live on the platform. Clients can discover your portfolio, view your services, and submit booking requests directly to you.</p>
          <div style="text-align: center;">
            <a href="${loginUrl}" class="btn">Access Artist Portal</a>
          </div>
          <p>We're thrilled to have you showcase your craft on GlamBook!</p>
          <div class="footer">&copy; ${new Date().getFullYear()} GlamBook. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 5. Artist Profile Rejected Email Template
 */
export async function sendArtistRejectionEmail(
  to: string,
  ownerName: string,
  businessName: string | null | undefined,
  reason: string
) {
  const subject = "Update regarding your GlamBook Artist Application";
  const name = businessName || ownerName;
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/artist/profile`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcf1ef; padding: 24px; color: #1e1a19; }
          .card { max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #fcdadb; }
          .logo { font-size: 24px; font-weight: bold; color: #eb7583; margin-bottom: 20px; }
          .reason-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; margin: 16px 0; border-radius: 6px; font-size: 14px; color: #991b1b; }
          .btn { display: inline-block; background-color: #1e1a19; color: #ffffff !important; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { font-size: 12px; color: #a09b9a; margin-top: 24px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">GlamBook</div>
          <h2>Application Status Update</h2>
          <p>Hello ${name},</p>
          <p>Thank you for submitting your artist application to GlamBook. After careful review, our administration team was unable to approve your profile at this time due to the following feedback:</p>
          <div class="reason-box">
            <strong>Reason for rejection:</strong><br>
            ${reason}
          </div>
          <p>You can update your profile, portfolio photos, or details to re-apply for review:</p>
          <div style="text-align: center;">
            <a href="${loginUrl}" class="btn">Update Artist Profile</a>
          </div>
          <div class="footer">&copy; ${new Date().getFullYear()} GlamBook. All rights reserved.</div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}
