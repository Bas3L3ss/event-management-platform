// pages/featured-events.tsx

import {
  getLatestFeaturedEvent,
  getOneLatestFeaturedEvent,
} from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
export default async function FeaturedEventsPage() {
  // Fetch multiple featured events
  const featuredEvents: Event[] = await getLatestFeaturedEvent();
  if (!featuredEvents || featuredEvents.length === 0)
    return <p>No featured events available.</p>;

  // Fetch the most up-to-date featured event
  const oneFeaturedEvent = await getOneLatestFeaturedEvent(5);
  if (!oneFeaturedEvent) return <p>No latest featured event available.</p>;

  return (
    <div>
      <h1>Featured Events</h1>
      <ul>
        {featuredEvents.map((event: Event) => (
          <li key={event.id}>
            <h2>{event.eventName}</h2>
            <p>{event.eventDescription}</p>
          </li>
        ))}
      </ul>

      <h2>Most Recent Featured Event</h2>
      <div>
        <h3>{oneFeaturedEvent.eventName}</h3>
        <p>{oneFeaturedEvent.eventDescription}</p>
      </div>
    </div>
  );
}
