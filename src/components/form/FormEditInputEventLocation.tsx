"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import dynamic from "next/dynamic";
import SkeletonLoading from "../SkeletonLoading";

const EventLocationPicker = dynamic(
  () => import("@/components/EventLocationPicker"),
  {
    loading: () => <SkeletonLoading />,
  }
);
const FormEditInputEventLocation = ({
  eventLocation,
  lat,
  lon,
}: {
  eventLocation: string;
  lon: number | null;
  lat: number | null;
}) => {
  const [location, setLocation] = useState<string>(eventLocation);
  const [latitude, setLatitude] = useState<number | null>(lat);
  const [longitude, setLongitude] = useState<number | null>(lon);
  return (
    <div>
      <div className="mb-2">
        <Label
          htmlFor={"eventLocation"}
          className="mb-2 block text-sm font-medium text-primary"
        >
          Event Location
        </Label>
        <Input
          id={"eventLocation"}
          name={"eventLocation"}
          readOnly={true}
          type={"text"}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />
      </div>
      <input
        type="hidden"
        name="latitude"
        value={!latitude ? undefined : latitude}
        onChange={(e) => {
          setLatitude(parseFloat(e.target.value));
        }}
      />
      <input
        type="hidden"
        name="longitude"
        value={!longitude ? undefined : longitude}
        onChange={(e) => {
          setLongitude(parseFloat(e.target.value));
        }}
      />
      <EventLocationPicker
        longitude={lon}
        place={eventLocation}
        setLatitude={setLatitude}
        latitude={lat}
        setPlace={setLocation}
        setLongitude={setLongitude}
      />
    </div>
  );
};

export default FormEditInputEventLocation;
