import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/utils/actions/usersActions"; // Import the createUser action

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Process the verified webhook event
  const eventType = evt.type;

  // Only proceed if the event is a 'user.created' event
  if (eventType === "user.created") {
    const user = evt.data; // Get the user data from the webhook event

    try {
      // Call the createUser action with the relevant user details from the Clerk webhook
      await createUser({
        clerkId: user.id,
        userName: user.username || user.first_name || "Anonymous", // Fallback for name
        userEmail: user.email_addresses[0].email_address, // First verified email
        userAvatar: user.image_url || "", // Default to empty string
        userBiography: "", // Default to empty string
      });

      console.log(`User with Clerk ID: ${user.id} created successfully.`);
    } catch (error) {
      console.error("Error creating user in database:", error);
      return new Response("Error occurred while creating user", {
        status: 500,
      });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
