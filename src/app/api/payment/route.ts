import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest } from "next/server";
import prisma from "@/utils/db";
import { calculateEventPrice, limitWords, sanitizeText } from "@/utils/utils";

export const POST = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");

  const { orderId, eventId } = await req.json();

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!order || !event) {
    return Response.json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const totalPrice = calculateEventPrice(event.dateStart, event.dateEnd);

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId, eventId },
      line_items: [
        {
          quantity: 1, // Single event payment
          price_data: {
            currency: "usd",
            product_data: {
              name: event.eventName, // Assuming there's an eventName field
              images: event.eventImg,
              description: sanitizeText(event.eventDescription),
            },
            unit_amount: totalPrice, // Total price based on event duration
          },
        },
      ],
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.log(error);

    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
