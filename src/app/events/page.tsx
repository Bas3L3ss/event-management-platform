import Container from "@/components/Container";
import EventsDisplay, { FiltersType } from "@/components/EventsDisplay";
import { getAllEvents } from "@/utils/actions/eventsActions";

async function EventsPage() {
  const eventsData = await getAllEvents();

  return (
    <Container>
      <EventsDisplay eventsData={eventsData} />
    </Container>
  );
}

export default EventsPage;
