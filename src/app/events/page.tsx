import Container from "@/components/Container";
import EventsDisplay, { FiltersType } from "@/components/EventsDisplay";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LIMIT } from "@/constants/values";
import { getEventsPaginated } from "@/utils/actions/eventsActions";

async function EventsPage() {
  const eventsData = await getEventsPaginated(0, LIMIT);

  return (
    <Container className="mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Events</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <EventsDisplay eventsData={eventsData} />
    </Container>
  );
}

export default EventsPage;
