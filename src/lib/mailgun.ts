import Mailgun from "mailgun.js";
import formData from "form-data";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_FROM = process.env.MAILGUN_FROM || "CrackTheLoop <postmaster@sandboxf7aea70bd961482e971e5e8156175a75.mailgun.org>";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY || "" });

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.warn("[MAILGUN] API Key or Domain missing. Skipping email.");
    return;
  }

  try {
    const result = await mg.messages.create(MAILGUN_DOMAIN, {
      from: MAILGUN_FROM,
      to,
      subject,
      text,
      html,
    } as any);
    console.log(`[MAILGUN] Email sent successfully to ${to}. Message ID: ${result.id}`);
    return result;
  } catch (error) {
    console.error("[MAILGUN] Error sending email:", error);
    throw error;
  }
}
export default mg;
