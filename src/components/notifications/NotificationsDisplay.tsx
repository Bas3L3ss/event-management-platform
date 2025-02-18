"use client";

import { FilterStatus } from "@/utils/types/EventTypes";
import { Notification } from "@prisma/client";
import { SortAsc, SortDesc } from "lucide-react";
import React, { useState } from "react";
import NotificationCard from "./NotificationCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOrder = "latest" | "oldest";

function NotificationsDisplay({
  notificationsFromDB,
}: {
  notificationsFromDB: Notification[];
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>(notificationsFromDB);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");

  const toggleSeenStatus = async (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, seenStatus: !notification.seenStatus }
          : notification
      )
    );
  };

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "seen") return notification.seenStatus;
      if (filterStatus === "unseen") return !notification.seenStatus;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.notificationCreatedAt).getTime();
      const dateB = new Date(b.notificationCreatedAt).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "latest" ? "oldest" : "latest");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Notifications</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <Select
              value={filterStatus}
              onValueChange={(e) => setFilterStatus(e as FilterStatus)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select filter mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unseen">Unseen</SelectItem>
                  <SelectItem value="seen">Seen</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 w-full sm:w-auto py-2 px-4 border border-gray-300 rounded-md"
            aria-label={`Sort ${
              sortOrder === "latest" ? "oldest to latest" : "latest to oldest"
            }`}
          >
            {sortOrder === "latest" ? (
              <SortDesc size={20} />
            ) : (
              <SortAsc size={20} />
            )}
            <span>{sortOrder === "latest" ? "Latest" : "Oldest"}</span>
          </button>
        </div>
      </div>
      {filteredNotifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications found.</p>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              toggleSeenStatus={() => toggleSeenStatus(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsDisplay;
