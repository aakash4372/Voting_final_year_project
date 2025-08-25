// sendTestEmail.js
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

// Brevo SMTP configuration
const SMTP_HOST = 'smtp-relay.brevo.com';
const SMTP_PORT = 587;
const SMTP_USER = process.env.SMTP_USER || '9586b7001@smtp-brevo.com';
const SMTP_PASS = process.env.SMTP_PASS || 'D8Um42IbrNtsZHAE';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'aakashaakash0013@gmail.com';
const SENDER_NAME = 'Voting System';
const TEST_RECIPIENT_EMAIL = 'test_recipient@example.com'; // Replace with your test recipient email
const TEST_RECIPIENT_NAME = 'Test User';

// Create a transporter object for sending emails
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // Use TLS, not SSL
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3', // Brevo recommends this for compatibility
  },
});

// Function to send test email
async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`, // Sender address
      to: `"${TEST_RECIPIENT_NAME}" <${TEST_RECIPIENT_EMAIL}>`, // Recipient address
      subject: 'Test Email from Voting System',
      text: 'This is a test email from the Voting System. If you received this, your Brevo SMTP configuration is working!',
      html: `
        <html>
          <body>
            <h1>Test Email</h1>
            <p>This is a test email sent from the Voting System using Brevo SMTP.</p>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
          </body>
        </html>
      `,
    });

    console.log('Test email sent successfully:', info.messageId);
    return {
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Error sending test email:', error.message);
    throw new Error('Failed to send test email: ' + error.message);
  }
}

// Execute the test email function
(async () => {
  try {
    await sendTestEmail();
  } catch (error) {
    console.error('Test email failed:', error.message);
  }
})();