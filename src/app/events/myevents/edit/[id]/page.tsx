import Container from "@/components/Container";
import { SubmitButton } from "@/components/form/Buttons";
import CheckboxInput from "@/components/form/CheckBoxInput";
import FormContainer from "@/components/form/FormContainer";
import FormEditContainer from "@/components/form/FormEditContainer";
import FormInput from "@/components/form/FormInput";
import ImagesAndVideoInputForEditPage from "@/components/form/ImagesAndVideoInputForEditPage";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEventById, updateEventAction } from "@/utils/actions/eventsActions";
import { EventType } from "@prisma/client";
import { redirect } from "next/navigation";

async function EditEventsPage({ params: { id } }: { params: { id: string } }) {
  const defaultEvent = await getEventById(id);
  if (!defaultEvent) redirect("/");
  const {
    eventDescription,
    dateEnd,
    dateStart,
    eventImg,
    eventImgOrVideoFirstDisplay,
    eventLocation,
    eventName,
    eventTicketPrice,
    eventVideo,
    reservationTicketLink,
    type,
    hostName,
  } = defaultEvent;

  const dateStartObject = new Date(dateStart.toString());
  const formattedStartDate = dateStartObject.toISOString().split("T")[0];
  const dateEndObject = new Date(dateEnd.toString());
  const formattedEndDate = dateEndObject.toISOString().split("T")[0];

  return (
    <Container className="mt-10">
      <h1 className="text-2xl font-semibold mb-8 capitalize">edit event</h1>
      <div className="border p-8 rounded-md">
        <FormEditContainer action={updateEventAction}>
          <div className="grid gap-4 md:grid-cols-2 my-4">
            <input type="hidden" className="sr-only" name="id" value={id} />
            <FormInput
              type="text"
              name="eventName"
              label="Event name"
              defaultValue={eventName}
            />
            <FormInput
              type="text"
              name="host"
              label="host"
              defaultValue={hostName as string | undefined}
            />
            <FormInput
              type="text"
              name="eventLocation"
              label="Event Location"
              defaultValue={eventLocation}
            />
            <FormInput
              type="text"
              name="reservationTicketLink"
              label="Reservation Ticket Link"
              defaultValue={reservationTicketLink}
            />
            <PriceInput defaultValue={eventTicketPrice} />
            <div className="w-full h-full ">
              <Label htmlFor="eventType">event types</Label>
              <select
                name="eventType"
                id="eventType"
                className=" w-full p-2 mt-auto"
                defaultValue={type}
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
            defaultValue={eventDescription}
          />

          <div className="mt-6 w-full  flex gap-5">
            <div className="flex-1">
              <Label htmlFor="dateStart">Date Start</Label>
              <Input
                defaultValue={formattedStartDate}
                id="dateStart"
                type="date"
                name="dateStart"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dateEnd">Date End</Label>

              <Input
                defaultValue={formattedEndDate}
                id="dateEnd"
                type="date"
                name="dateEnd"
              />
            </div>
          </div>
          <div className="mt-6">
            <ImagesAndVideoInputForEditPage
              existingImages={eventImg}
              existingVideo={eventVideo}
            />
          </div>
          <div className="mt-6">
            <CheckboxInput
              name="isVideoFirstDisplay"
              label="Video Display First"
            />
          </div>
          <SubmitButton text="Edit event" className="mt-8" />
        </FormEditContainer>
      </div>
    </Container>
  );
}
export default EditEventsPage;
