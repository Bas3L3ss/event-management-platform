// pages/api/webhooks/clerk.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifySignature } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Verify the Clerk webhook signature
  const signature = req.headers["clerk-signature"] as string;
  const payload = req.body;

  if (!verifySignature(signature, payload)) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    // Handle the webhook event
    if (req.method === "POST") {
      const event = req.body;

      if (event.type === "user.created") {
        const userData = event.data;
        await prisma.user.create({
          data: {
            clerkId: userData.id,
            userName: userData.username || "",
            userBiography: userData.biography || "",
            userAvatar: userData.avatar || "",
            // Set other fields as needed
          },
        });
        res.status(200).json({ message: "User created in database" });
      } else {
        res.status(200).json({ message: "Event type not handled" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling webhook", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
