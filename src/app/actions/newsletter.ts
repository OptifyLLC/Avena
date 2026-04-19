"use server";

export async function subscribeToNewsletter(email: string) {
  const webhookUrl = process.env.N8N_NEWSLETTER_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("N8N_NEWSLETTER_WEBHOOK_URL is not defined");
    return { success: false, error: "Configuration error" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe. Please try again later." };
  }
}
