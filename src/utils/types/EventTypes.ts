import { EventType } from "@prisma/client";

export type EventSchemaType = {
  eventName: string;
  host: string;
  eventType: EventType;
  reservationTicketLink: string;
  eventLocation: string;
  price: number;
  description: string;
  isVideoFirstDisplay: boolean;
  latitude: number;
  longitude: number;
};

export type FullEventSchemaType = EventSchemaType & {
  dateStart: Date;
  dateEnd: Date;
};

export type FilterStatus = "all" | "seen" | "unseen";
