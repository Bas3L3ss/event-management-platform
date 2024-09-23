import { redirect } from "next/navigation";
import prisma from "../db";
import { authenticateAndRedirect } from "./clerkFunc";
import { renderError } from "./eventsActions";
import { Event } from "@prisma/client";
import { calculateEventPrice } from "../utils";

export const createOrderAction = async (clerkId: string, event: Event) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });

    if (!event || !user) {
      redirect("/");
    }
    const order = await prisma.order.create({
      data: {
        eventName: event.eventName,
        eventId: event.id,
        clerkId: clerkId,
        orderTotal: calculateEventPrice(event.dateStart, event.dateEnd),
        tax: 0,
        email: user?.userEmail,
      },
    });
    console.log(order);

    // orderId = order.id;
  } catch (error) {
    return renderError(error);
  }
};

export const getOrderByClerkId = async (clerkId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: { clerkId },
    });
    console.log(orders);

    return orders;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch order");
  }
};
