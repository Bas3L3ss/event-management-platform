import Container from "@/components/Container";
import { SubmitButton } from "@/components/form/Buttons";
import CheckboxInput from "@/components/form/CheckBoxInput";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import ImageInput from "@/components/form/ImageInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import VideoInput from "@/components/form/VideoInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEventAction } from "@/utils/actions/eventsActions";
import { faker } from "@faker-js/faker";
import { EventType } from "@prisma/client";

async function AddEventsPage() {
  const name = faker.commerce.productName();
  const host = faker.company.name();
  const location =
    faker.location.streetAddress() +
    " " +
    faker.location.city() +
    ", " +
    faker.location.country();
  const description = faker.lorem.paragraph({ min: 10, max: 12 });
  const eventTicketLink = faker.internet.url();

  return (
    <Container className="mt-10">
      <h1 className="text-2xl font-semibold mb-8 capitalize">add event</h1>
      <div className="border p-8 rounded-md">
        <FormContainer action={createEventAction}>
          <div className="grid gap-4 md:grid-cols-2 my-4">
            <FormInput
              type="text"
              name="eventName"
              label="Event name"
              defaultValue={name}
            />
            <FormInput
              type="text"
              name="host"
              label="host"
              defaultValue={host}
            />
            <FormInput
              type="text"
              name="eventLocation"
              label="Event Location"
              defaultValue={location}
            />
            <FormInput
              type="text"
              name="reservationTicketLink"
              label="Reservation Ticket Link"
              defaultValue={eventTicketLink}
            />
            <PriceInput />
            <div className="w-full h-full ">
              <Label htmlFor="eventType">event types</Label>
              <select
                name="eventType"
                id="eventType"
                className=" w-full p-2 mt-auto"
              >
                <option value="">Choose Events Type</option>
                {Object.values(EventType).map((status) => {
                  return (
                    <option className="capitalize" key={status} value={status}>
                      {status.toLowerCase().replace(/_/g, " ")}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <TextAreaInput
            name="description"
            labelText="product description"
            defaultValue={description}
          />

          <div className="mt-6 w-full  flex gap-5">
            <div className="flex-1">
              <Label htmlFor="dateStart">Date Start</Label>
              <Input id="dateStart" type="date" name="dateStart" />
            </div>
            <div className="flex-1">
              <Label htmlFor="dateEnd">Date End</Label>

              <Input id="dateEnd" type="date" name="dateEnd" />
            </div>
          </div>
          <div className="mt-6">
            <ImageInput />
            <VideoInput />
          </div>
          <div className="mt-6">
            <CheckboxInput
              name="isVideoFirstDisplay"
              label="Video Display First"
            />
          </div>
          <SubmitButton text="Create event" className="mt-8" />
        </FormContainer>
      </div>
    </Container>
  );
}
export default AddEventsPage;
