import Container from "@/components/Container";
import { SubmitButton } from "@/components/form/Buttons";
import CheckboxInput from "@/components/form/CheckBoxInput";
import DeleteEventButton from "@/components/form/DeleteEventButton";
import FormEditContainer from "@/components/form/FormEditContainer";
import FormEditInputEventLocation from "@/components/form/FormEditInputEventLocation";
import FormInput from "@/components/form/FormInput";
import ImagesAndVideoInputForEditPage from "@/components/form/ImagesAndVideoInputForEditPage";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  deleteEventWithRelations,
  getEventById,
  getOrderByEventId,
  updateEventAction,
} from "@/utils/actions/eventsActions";
import { getUserByClerkId } from "@/utils/actions/usersActions";
import { auth } from "@clerk/nextjs/server";
import { EventType } from "@prisma/client";
import Link from "next/link";

import { redirect } from "next/navigation";

async function EditEventsPage({ params: { id } }: { params: { id: string } }) {
  const defaultEvent = await getEventById(id);
  const relatedOrder = await getOrderByEventId(id);

  if (!defaultEvent || !relatedOrder) redirect("/events/myevents");
  const {
    eventDescription,
    dateEnd,
    dateStart,
    eventImg,
    eventLocation,
    latitude,
    longitude,
    eventName,
    eventTicketPrice,
    eventVideo,
    reservationTicketLink,
    type,
    hostName,
  } = defaultEvent;
  const author = await getUserByClerkId(defaultEvent.clerkId);
  const curUserClerkId = auth().userId;

  if (author?.clerkId != curUserClerkId) redirect("/events/myevents");

  const dateStartObject = new Date(dateStart.toString());
  const formattedStartDate = dateStartObject.toISOString().split("T")[0];
  const dateEndObject = new Date(dateEnd.toString());
  const formattedEndDate = dateEndObject.toISOString().split("T")[0];

  return (
    <Container className="mt-10 flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events/myevents">My Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Event</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold  ">Edit Event</h1>
      <div className="border border-border p-8 rounded-lg shadow-sm bg-card">
        <div className="relative">
          <div className="absolute top-0 right-0">
            <DeleteEventButton
              eventName={defaultEvent.eventName}
              isPaid={relatedOrder?.isPaid}
              deleteEvent={deleteEventWithRelations}
              eventId={id}
            />
          </div>
          <FormEditContainer action={updateEventAction}>
            <div className="grid gap-6 md:grid-cols-2 my-4">
              <input type="hidden" className="sr-only" name="id" value={id} />
              <input
                type="hidden"
                className="sr-only"
                name="isPaid"
                value={`${relatedOrder.isPaid}`}
              />
              <FormInput
                type="text"
                name="eventName"
                label="Event Name"
                defaultValue={eventName}
              />
              <FormInput
                type="text"
                name="host"
                label="Host"
                defaultValue={hostName as string | undefined}
              />

              <FormInput
                type="text"
                name="reservationTicketLink"
                label="Reservation Ticket Link"
                defaultValue={reservationTicketLink}
              />
              <PriceInput defaultValue={eventTicketPrice} />
              <div className="w-full">
                <Label
                  htmlFor="eventType"
                  className="mb-2 block text-sm font-medium text-primary"
                >
                  Event Type
                </Label>
                <select
                  name="eventType"
                  id="eventType"
                  className="w-full p-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary"
                  defaultValue={type}
                >
                  <option value="">Choose Event Type</option>
                  {Object.values(EventType).map((status) => (
                    <option className="capitalize" key={status} value={status}>
                      {status.toLowerCase().replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <TextAreaInput
                name="description"
                labelText="Event Description"
                defaultValue={eventDescription}
              />
            </div>
            <div className="mt-6">
              <FormEditInputEventLocation
                eventLocation={!latitude ? "" : eventLocation}
                lat={latitude ? latitude : null}
                lon={longitude ? longitude : null}
              />
            </div>
            {!relatedOrder.isPaid && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="dateStart"
                    className="mb-2 block text-sm font-medium text-primary"
                  >
                    Start Date
                  </Label>
                  <Input
                    defaultValue={formattedStartDate}
                    id="dateStart"
                    type="date"
                    name="dateStart"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="dateEnd"
                    className="mb-2 block text-sm font-medium text-primary"
                  >
                    End Date
                  </Label>
                  <Input
                    defaultValue={formattedEndDate}
                    id="dateEnd"
                    type="date"
                    name="dateEnd"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-primary">Media</h3>
              <ImagesAndVideoInputForEditPage
                existingImages={eventImg}
                existingVideo={eventVideo}
              />
            </div>

            <div className="mt-6">
              <CheckboxInput
                name="isVideoFirstDisplay"
                label="Display Video First"
              />
            </div>
            <div
              className={cn(
                "grid grid-cols-2 gap-4",
                relatedOrder.isPaid && "grid-cols-1"
              )}
            >
              <SubmitButton text="Update Event" className="mt-8 text-white " />
              {!relatedOrder.isPaid && (
                <Button
                  className=" bg-green-600 hover:bg-green-500 mt-8"
                  size={"lg"}
                  asChild
                >
                  <Link
                    href={`/checkout?orderId=${relatedOrder.id}&eventId=${relatedOrder.eventId}`}
                    className="text-white"
                  >
                    Activate Advertisement
                  </Link>
                </Button>
              )}
            </div>
          </FormEditContainer>
        </div>
      </div>
    </Container>
  );
}

export default EditEventsPage;
