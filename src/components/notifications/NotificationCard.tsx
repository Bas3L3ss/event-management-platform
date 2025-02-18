"use client";

import MediaRenderer from "@/components/MediaFileRender";
import { getEventById } from "@/utils/actions/eventsActions";
import { Event, Notification } from "@prisma/client";

import { Bell, Calendar, Eye, EyeOff, List, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toastPrint } from "@/utils/toast action/action";
import { CardTitle } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Link from "next/link";
import DatePrinter from "../DatePrinter";

export default function NotificationCard({
  notification,
  toggleSeenStatus,
}: {
  notification: Notification;
  toggleSeenStatus: (id: string) => Promise<void>;
}) {
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const details = await getEventById(notification.eventId);
        setEventDetails(details);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    loadEventDetails();
  }, [notification.eventId, notification.seenStatus]);

  const handleChangeSeen = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: notification.id,
          isSeen: !notification.seenStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toastPrint(
        "Error",
        "Unable to change your notifications . Please try again later.",
        "destructive"
      );
    }
  };

  return (
    <div
      className={`bg-primary-foreground rounded-lg shadow-md overflow-hidden ${
        notification.seenStatus ? "opacity-75" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Image
              width={500}
              height={500}
              className="w-10 h-10 rounded-full"
              src={notification.userAvatar}
              alt={notification.userName}
            />
            <div>
              <h2 className="font-semibold text-lg">
                {notification.title} |{" "}
                <span className="font-bold text-primary">
                  <Link href={`/events/${eventDetails?.id}`}>
                    {" "}
                    {eventDetails?.eventName}
                  </Link>
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                {notification.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              toggleSeenStatus(notification.id);
              handleChangeSeen();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            {notification.seenStatus ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {eventDetails && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <DatePrinter
                dateEnd={eventDetails.dateEnd}
                dateStart={eventDetails.dateStart}
              />
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User size={16} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      className="hover:!text-primary  "
                      href={`/profile/${notification.clerkId}`}
                    >
                      {notification.userName}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary rounded-md text-xs text-white p-[2px]">
                    <p>Review profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
      <div className="relative overflow-hidden">
        {eventDetails?.eventImgOrVideoFirstDisplay && (
          <MediaRenderer
            alt={eventDetails.eventName}
            url={eventDetails.eventImgOrVideoFirstDisplay}
          />
        )}
      </div>
      <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600">
        <Bell size={16} className="inline mr-2" />
        {format(
          new Date(notification.notificationCreatedAt),
          "MMMM do, yyyy - HH:mm"
        )}
      </div>
    </div>
  );
}
