import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFieldsForStep = (step: number): any => {
  switch (step) {
    case 0:
      return ["eventType"];
    case 1:
      return [
        "eventName",
        "host",
        "eventLocation",
        "description",
        "price",
        "reservationTicketLink",
      ];
    case 2:
      return ["dateStart", "dateEnd"];
    case 3:
      return ["eventImage", "eventVideo", "isVideoFirstDisplay"];
    default:
      return [];
  }
};
