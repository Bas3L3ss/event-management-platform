import { redirect } from "next/navigation";
import prisma from "../db";
import { authenticateAndRedirect } from "./clerkFunc";
import { Event, Order } from "@prisma/client";
import { calculateEventPrice, renderError } from "../utils";
import { cache } from "../cache";

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

    // orderId = order.id;
  } catch (error) {
    return renderError(error);
  }
};
//  getOrderByClerkId
async function cachedGetOrderByClerkId(clerkId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { clerkId },
    });

    return orders;
  } catch (error) {
    console.error(`Error fetching orders for clerk with id ${clerkId}:`, error);
    throw new Error("Failed to fetch orders");
  }
}

// Wrap the fetchOrderByClerkId function with caching logic
const getCachedOrderByClerkId = (clerkId: string) => {
  return cache(cachedGetOrderByClerkId, ["orders", clerkId], {
    revalidate: 60, // Revalidate cache every 60 seconds
  })(clerkId); // Call the caching function with clerkId
};

export const getOrderByClerkId = async (clerkId: string): Promise<Order[]> => {
  return await getCachedOrderByClerkId(clerkId);
};

export const getAllOderInAdminPage = async () => {
  const clerkId = authenticateAndRedirect();
  const isAdmin = clerkId === process.env.CLERK_ADMIN_ID;
  if (!isAdmin) {
    redirect("/");
  }
  try {
    const orders = prisma.order.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return orders;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch orders");
  }
};
