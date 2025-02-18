"use client";

import { useEffect, useRef, useState } from "react";
import L, { Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  lat: number;
  lon: number;
}

const EventLocationMap: React.FC<MapComponentProps> = ({ lat, lon }) => {
  const mapRef = useRef<Map | null>(null);
  const [marker, setMarker] = useState<Marker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!mapRef.current) {
        const mapInstance = L.map("map").setView([lat, lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance);
        mapRef.current = mapInstance;

        const customIcon = L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        const newMarker = L.marker([lat, lon], { icon: customIcon }).addTo(
          mapRef.current
        );
        setMarker(newMarker);
      } else {
        mapRef.current.setView([lat, lon], 13);
        if (marker) {
          marker.setLatLng([lat, lon]);
        }
      }
    }
  }, [lat, lon]);

  return (
    <div id="map" className="h-[500px] w-full rounded-md mb-4 z-[100]"></div>
  );
};

export default EventLocationMap;
