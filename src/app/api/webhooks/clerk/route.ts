import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  console.log("Webhook triggered");

  // Ensure your webhook isn't entering a loop
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

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

// import { NextResponse } from "next/server";
// import prisma from "@/utils/db"; // Assuming you're using Prisma for database management

// const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
// export async function POST(req: Request) {
//   console.log("Webhook POST request received");

//   if (!WEBHOOK_SECRET) {
//     console.error("CLERK_WEBHOOK_SECRET is not set");
//     return NextResponse.json(
//       { error: "CLERK_WEBHOOK_SECRET is not set" },
//       { status: 500 }
//     );
//   }

//   // Get the headers
//   const headerPayload = headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     console.error("Error occurred -- missing svix headers");
//     return NextResponse.json(
//       { error: "Error occurred -- missing svix headers" },
//       { status: 400 }
//     );
//   }

//   // Get the body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   // Create a new Svix instance with your secret.
//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt: WebhookEvent;

//   // Verify the payload with the headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return NextResponse.json(
//       { error: "Error verifying webhook" },
//       { status: 400 }
//     );
//   }

//   const eventType = evt.type;
//   console.log("Webhook event type:", eventType);

//   if (eventType === "user.created") {
//     const {
//       id: clerkId,
//       email_addresses,
//       first_name,
//       last_name,
//       image_url,
//     } = evt.data;
//     const primaryEmail = email_addresses.find(
//       (email) => email.id === evt.data.primary_email_address_id
//     );

//     if (!clerkId || !primaryEmail) {
//       console.error("Error occurred -- missing data");
//       return NextResponse.json(
//         { error: "Error occurred -- missing data" },
//         { status: 400 }
//       );
//     }

//     try {
//       const newUser = await prisma.user.create({
//         data: {
//           clerkId: clerkId,
//           userName: `${first_name || ""} ${last_name || ""}`.trim(),
//           userBiography: "",
//           userAvatar: image_url || "",
//           followers: [],
//           followedByUsers: [],
//           isAuthorizedUser: false,
//           notifications: {
//             create: [], // Initial empty notifications, assuming Notification model is set up
//           },
//           deletedAt: "",
//         },
//       });

//       console.log("User created successfully:", newUser);
//       return NextResponse.json(
//         { message: "User created successfully" },
//         { status: 200 }
//       );
//     } catch (error) {
//       console.error("Error creating user:", error);
//       return NextResponse.json(
//         { error: "Error creating user" },
//         { status: 500 }
//       );
//     }
//   }

//   if (eventType === "user.deleted") {
//     const { id: clerkId } = evt.data;

//     if (!clerkId) {
//       console.error("Error in user deletion webhook: Missing clerkId");
//       return NextResponse.json(
//         { error: "Error occurred -- missing clerkId" },
//         { status: 400 }
//       );
//     }

//     try {
//       const deletedUser = await prisma.user.update({
//         where: { clerkId },
//         data: { deletedAt: new Date() },
//       });

//       console.log(`User soft deleted: ${clerkId}`);
//       return NextResponse.json(
//         { message: "User soft deleted successfully" },
//         { status: 200 }
//       );
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       return NextResponse.json(
//         { error: "Error deleting user" },
//         { status: 500 }
//       );
//     }
//   }

//   console.log("Webhook processed successfully");
//   return NextResponse.json(
//     { message: "Webhook processed successfully" },
//     { status: 200 }
//   );
// }
