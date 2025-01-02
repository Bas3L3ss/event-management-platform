"use client";

import { FilterStatus } from "@/utils/types/EventTypes";
import { Notification } from "@prisma/client";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import React, { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { changeSeenStateNotification } from "@/utils/actions/usersActions";

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
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Notifications</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              className="border rounded-md px-2 py-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              aria-label="Filter notifications"
            >
              <option value="all">All</option>
              <option value="unseen">Unseen</option>
              <option value="seen">Seen</option>
            </select>
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
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
        <div className="grid gap-6">
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
