import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Notification } from "@prisma/client";
import { getEventById } from "@/utils/actions/eventsActions";
import { getNotificationsByClerkId } from "@/utils/actions/usersActions";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { auth } from "@clerk/nextjs/server";
import NotificationsDisplay from "@/components/notifications/NotificationsDisplay";
import Container from "@/components/Container";

export default async function NotificationPage() {
  const notifications = await getNotificationsByClerkId();
  return (
    <Container>
      <NotificationsDisplay notificationsFromDB={notifications} />
    </Container>
  );
}
