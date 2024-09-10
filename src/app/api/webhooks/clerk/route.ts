import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

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
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
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
