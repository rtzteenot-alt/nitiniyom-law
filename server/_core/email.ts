import { ENV } from "./env";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Sends an email using the Manus built-in email service
 * Returns `true` if the email was sent successfully, `false` otherwise
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const { to, subject, html } = payload;

  if (!ENV.forgeApiUrl) {
    console.warn("[Email] Email service URL is not configured.");
    return false;
  }

  if (!ENV.forgeApiKey) {
    console.warn("[Email] Email service API key is not configured.");
    return false;
  }

  const endpoint = new URL(
    "email.v1.EmailService/Send",
    ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send email to ${to} (${response.status} ${response.statusText})${
          detail ? `: ${detail}` : ""
        }`
      );
      return false;
    }

    console.log(`[Email] Successfully sent email to ${to}`);
    return true;
  } catch (error) {
    console.warn(`[Email] Error sending email to ${to}:`, error);
    return false;
  }
}
