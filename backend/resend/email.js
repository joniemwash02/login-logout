import { resend } from "./config.js";
import { verificationTokenemailTemplate, welcomeEmailTemplate } from "./email-template.js";
export const verificationEmail = async ( verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["joniemwash2@gmail.com"],
      subject: "Verify Your Email Address Now",
      html: verificationTokenemailTemplate .replace("{verificationToken}", verificationToken),
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
}