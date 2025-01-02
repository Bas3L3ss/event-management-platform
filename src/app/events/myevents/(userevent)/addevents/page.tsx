import Container from "@/components/Container";
import DatetimePickerPlaceholder from "@/components/DateTimePickerPlaceHolder";
import { SubmitButton } from "@/components/form/Buttons";
import CheckboxInput from "@/components/form/CheckBoxInput";
import DateTimePicker from "@/components/form/DateTimePicker";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import ImageInput from "@/components/form/ImageInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import VideoInput from "@/components/form/VideoInput";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEventAction } from "@/utils/actions/eventsActions";
import { EventType } from "@prisma/client";

async function AddEventsPage() {
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
            <BreadcrumbPage>Add Event</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold  ">Add Event</h1>
      <div className="border border-border p-8 rounded-lg shadow-sm bg-card">
        <FormContainer action={createEventAction}>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <FormInput type="text" name="eventName" label="Event Name" />
            <FormInput type="text" name="host" label="Host" />
            <FormInput
              type="text"
              name="eventLocation"
              label="Event Location"
            />
            <FormInput
              type="text"
              name="reservationTicketLink"
              label="Reservation Ticket Link"
            />
            <PriceInput />
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
          <div className="mb-6">
            <TextAreaInput name="description" labelText="Event Description" />
          </div>
          <DateTimePicker />

          <div className="space-y-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Event Image
              </h3>
              <ImageInput />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">
                Event Video
              </h3>
              <VideoInput />
            </div>
          </div>
          <div className="mb-6">
            <CheckboxInput
              name="isVideoFirstDisplay"
              label="Display Video First"
            />
          </div>
          <SubmitButton text="Create Event" className="w-full" />
        </FormContainer>
      </div>
    </Container>
  );
}

export default AddEventsPage;
