import nodemailer from 'nodemailer';

const FROM_EMAIL = 'Coach Jake <bbcodejc@gmail.com>';
const GMAIL_USER = 'bbcodejc@gmail.com';

// Singleton transporter (reused across invocations within same serverless instance)
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });

  return _transporter;
}

export interface SendGmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendGmailEmail(
  options: SendGmailOptions
): Promise<{ success: boolean; error?: string }> {
  // Fail if credentials are missing
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error('[Gmail] GMAIL_APP_PASSWORD not configured!');
    return { success: false, error: 'GMAIL_APP_PASSWORD not configured' };
  }

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: options.to,
      replyTo: options.replyTo || GMAIL_USER,
      subject: options.subject,
      text: options.text,
      html: options.html || undefined,
    });

    console.log(`[Gmail] Email sent to ${options.to}: "${options.subject}"`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Gmail error';
    console.error(`[Gmail] Failed to send to ${options.to}:`, message);
    return { success: false, error: message };
  }
}
