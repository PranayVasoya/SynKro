import nodemailer from "nodemailer";
import User from "@/models/userModel";
import crypto from "crypto";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    if (!email || !emailType || !userId) {
      throw new Error("Email, emailType, and userId are required");
    }

    if (!process.env.DOMAIN || !process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Mailer: Generated token:", token);
    console.log("Mailer: Hashed token:", hashedToken);

    if (emailType === "VERIFY") {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000,
          },
        },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      console.log("Mailer: User updated for verification, email:", email);
    } else if (emailType === "RESET") {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          },
        },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      console.log("Mailer: User updated for password reset, email:", email);
    } else {
      throw new Error("Invalid emailType");
    }

    const verificationLink = `${process.env.DOMAIN}/verifyemail?token=${token}`;
    console.log("Mailer: Verification link:", verificationLink);

    const mailOptions = {
      from: "mehra.dhairya.btech2022@sitpune.edu.in",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <p>Click <a href="${verificationLink}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.</p>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${verificationLink}</p>
      `,
    };

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Mailer: Email sent successfully to:", email, "Response:", mailResponse);
    return mailResponse;
  } catch (error: any) {
    console.error("Mailer: Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};