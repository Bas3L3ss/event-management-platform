import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  console.log("Webhook triggered");

  // Ensure your webhook isn't entering a loop
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET");
    return new Response("Webhook secret missing", { status: 500 });
  }

  const headerPayload = headers();
  console.log("Received Headers:", headerPayload);

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  try {
    const payload = await req.json();
    console.log("Received Payload:", payload);

    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    console.log("Verified Webhook:", evt);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error in webhook processing:", err);
    return new Response("Error occurred", { status: 400 });
  }
}

export async function GET(req: Request) {
  console.log("Webhook triggered");
  return new Response("Hi", { status: 200 });
}
