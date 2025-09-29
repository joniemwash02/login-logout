import { url } from "inspector";
import { resend } from "./config.js";
import {
  verificationTokenemailTemplate,
  welcomeEmailTemplate,
} from "./email-template.js";
export const verificationEmail = async (verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["joniemwash2@gmail.com"],
      subject: "Verify Your Email Address Now",
      html: verificationTokenemailTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendwelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["joniemwash2@gmail.com"],
      subject: "Welcome to Acme!",
      html: welcomeEmailTemplate.replace("{name}", name),
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async ( resetURL) => {
  try {
      const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["joniemwash2@gmail.com"],
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password:</p>`,
    });

  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
    
  }


}
export const sendResetSuccessEmail = async ( name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["joniemwash2@gmail.com"],
      subject: "Password Reset Successful",
      html: `<p>Hello ${name},</p><p>Your password has been reset successfully.</p>`,
    });
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error("Failed to send password reset success email");
  }
};
