import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../utils/db";
import { EventStatus } from "@prisma/client";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const today = new Date();

  try {
    // Delete events with status NOT CONFIRMED that have passed their start date
    await db.event.deleteMany({
      where: {
        status: EventStatus.NOT_CONFIRMED,
        dateStart: {
          lte: today,
        },
      },
    });

    // Update status to STARTED for upcoming events whose start date is today
    await db.event.updateMany({
      where: {
        status: EventStatus.UPCOMING,
        dateStart: {
          lte: today,
        },
      },
      data: {
        status: EventStatus.STARTED,
      },
    });

    // Update status to ENDED for started events whose end date is today
    await db.event.updateMany({
      where: {
        status: EventStatus.STARTED,

        dateEnd: {
          gte: today,
        },
      },
      data: {
        status: EventStatus.ENDED,
      },
    });

    res.status(200).json({ message: "Scheduled tasks executed successfully." });
  } catch (error) {
    console.error("Error executing scheduled tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
