export const generateOTPVerificationTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Smart Voting System</h2>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <h1 style="color: #555; font-size: 24px; text-align: center;">Email Verification</h1>
      <p style="color: #666; font-size: 16px; line-height: 1.5;">
        Thank you for registering. To complete your registration, please use the following One-Time Password (OTP).
      </p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 32px; font-weight: bold; color: #007bff; margin: 0;">${otp}</p>
      </div>
      <p style="color: #666; font-size: 14px; text-align: center;">This code is valid for 10 minutes.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">If you did not sign up for an account, please ignore this email.</p>
    </div>
  `;
};