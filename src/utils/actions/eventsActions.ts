// EventActions.ts

import prisma from "../db";

export async function getLatestFeaturedEvent(
  amount: number = 2,
  prevState?: any
) {
  try {
    const latestEvent = await prisma.event.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        dateStart: "asc", // Fetch the event with the earliest start date
      },
      take: amount,
    });

    return latestEvent;
  } catch (error) {
    console.error("Error fetching the latest featured event:", error);
    throw new Error("Unable to fetch the latest featured event");
  } finally {
    await prisma.$disconnect();
  }
}
export async function getOneLatestFeaturedEvent(prevState?: any) {
  try {
    const latestEvent = await prisma.event.findFirst({
      where: {
        featured: true,
      },
      orderBy: {
        dateStart: "asc", // Fetch the event with the earliest start date
      },
    });

    return latestEvent;
  } catch (error) {
    console.error("Error fetching the latest featured event:", error);
    throw new Error("Unable to fetch the latest featured event");
  } finally {
    await prisma.$disconnect();
  }
}
