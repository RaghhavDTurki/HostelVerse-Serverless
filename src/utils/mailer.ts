import sendGridMail from "@sendgrid/mail";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export async function sendOTPEmail(email: string, code: number): 
Promise<{
  error: boolean;
  message?: undefined;
} | {
  error: boolean;
  message: string;
}> {
  // const account = await nodemailer.createTestAccount();
  sendGridMail.setApiKey(SENDGRID_API_KEY);
  try {
    const senderAddress = "hostelverse.aztecs@gmail.com";
    const toAddress = email;
    const subject = "Verify your email";
    // The body of the email for recipients
    const body_html = `<!DOCTYPE> 
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
        <p> Note: This code will only be valid for 15 mins</p> 
      </body>
    </html>`;

    // Specify the fields in the email.
    const mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };
    // const info = await transporter.sendMail(mailOptions);
    const info = await sendGridMail.send(mailOptions);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}