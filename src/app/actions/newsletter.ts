"use server";

export async function subscribeToNewsletter(email: string) {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("NEWSLETTER_WEBHOOK_URL is not defined");
    return { success: false, error: "Configuration error" };
  }

  try {
    const url = new URL(webhookUrl);
    url.searchParams.append("email", email);

    const response = await fetch(url.toString(), {
      method: "GET",
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
