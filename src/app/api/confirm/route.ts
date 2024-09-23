import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from "next/navigation";

import { type NextRequest } from "next/server";
import prisma from "@/utils/db";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id") as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // console.log(session);

    const orderId = session.metadata?.orderId;
    const eventId = session.metadata?.eventId;
    if (session.status === "complete") {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          PaidAt: new Date(),
        },
      });
    }
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        status: "UPCOMING",
      },
    });
  } catch (err) {
    console.log(err);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  redirect("/events/orders");
};
