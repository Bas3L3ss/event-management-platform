import { useFormContext } from "react-hook-form";
import FormInput from "@/components/form/FormInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import PriceInput from "@/components/form/PriceInput";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

import SkeletonLoading from "../SkeletonLoading";
import dynamic from "next/dynamic";

const EventLocationPicker = dynamic(
  () => import("@/components/EventLocationPicker"),
  {
    loading: () => <SkeletonLoading />,
  }
);

export function GeneralDetailsStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const [location, setLocation] = useState<string>(
    watch("eventLocation") || ""
  );
  const [latitude, setLatitude] = useState<number>(watch("latitude") || 0);
  const [longitude, setLongitude] = useState<number>(watch("longitude") || 0);
  useEffect(() => {
    setValue("eventLocation", location);
    setValue("latitude", latitude);
    setValue("longitude", longitude);
  }, [location, latitude, longitude]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event Details</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FormInput
            type="text"
            name="eventName"
            label="Event Name"
            isZod
            register={register}
            validation={{
              required: "Event name must be at least 2 characters",
            }}
          />
          {errors.eventName && (
            <p className="text-destructive text-sm mt-1">
              {errors.eventName.message as string}
            </p>
          )}
        </div>

        <div>
          <FormInput
            type="text"
            name="host"
            label="Host"
            isZod
            register={register}
            validation={{
              required: "Please fill in your event's host name",
            }}
          />
          {errors.host && (
            <p className="text-destructive text-sm mt-1">
              {errors.host.message as string}
            </p>
          )}
        </div>

        <div>
          <FormInput
            type="url"
            name="reservationTicketLink"
            label="Reservation Ticket Link"
            isZod
            register={register}
            validation={{
              pattern: {
                value: /^https?:\/\/.+/,
                message: "Reservation ticket link must be a valid URL",
              },
            }}
          />
          {errors.reservationTicketLink && (
            <p className="text-destructive text-sm mt-1">
              {errors.reservationTicketLink.message as string}
            </p>
          )}
        </div>

        <div>
          <PriceInput
            isZod
            register={register}
            validation={{
              required: "Price is required",
            }}
          />
          {errors.price && (
            <p className="text-destructive text-sm mt-1">
              {errors.price.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="col-span-2">
        <TextAreaInput
          watch={watch}
          name="description"
          labelText="Event Description"
          setValue={setValue}
          isZod
        />
        {errors.description && (
          <p className="text-destructive text-sm mt-1">
            {errors.description.message as string}
          </p>
        )}
      </div>
      <div>
        <div className="mb-2">
          <Label
            htmlFor={"eventLocation"}
            className="mb-2 block text-sm font-medium text-primary"
          >
            {"eventLocation"}
          </Label>
          <Input
            id={"eventLocation"}
            name={"eventLocation"}
            type="text"
            defaultValue={location}
            value={location}
            placeholder="Pick the location"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            disabled
          />
          <Input
            id={"latitude"}
            name={"latitude"}
            type="hidden"
            defaultValue={latitude}
            value={latitude}
            onChange={(e) => {
              setLatitude(parseFloat(e.target.value));
            }}
            disabled
          />
          <Input
            id={"longitude"}
            name={"longitude"}
            type="hidden"
            defaultValue={longitude}
            value={longitude}
            onChange={(e) => {
              setLongitude(parseFloat(e.target.value));
            }}
            disabled
          />
        </div>
        {errors.eventLocation && (
          <p className="text-destructive text-sm mt-1">
            {errors.eventLocation.message as string}
          </p>
        )}
      </div>
      <EventLocationPicker
        latitude={latitude}
        longitude={latitude}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        place={location}
        setPlace={setLocation}
      />
    </div>
  );
}
