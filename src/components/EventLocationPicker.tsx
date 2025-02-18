"use client";

import { useEffect, useRef, useState, ChangeEvent, Dispatch } from "react";
import L, { Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import SkeletonLoading from "./SkeletonLoading";

interface LocationSuggestion {
  lat: string;
  lon: string;
  display_name: string;
}

type EventLocationPickerProps = {
  place: string;
  latitude: number | null;
  longitude: number | null;
  setPlace: Dispatch<string>;
  setLongitude: Dispatch<number>;
  setLatitude: Dispatch<number>;
};

const EventLocationPicker = ({
  place,
  setPlace,
  setLatitude,
  setLongitude,
  latitude,
  longitude,
}: EventLocationPickerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapRef = useRef<Map | null>(null); // Ref to store the map instance
  const [marker, setMarker] = useState<Marker | null>(null);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(
    latitude && longitude
      ? {
          lat: latitude,
          lon: longitude,
        }
      : null
  );
  const [deletedSuggestions, setDeletedSuggestions] = useState<
    LocationSuggestion[]
  >(
    [] // Keeps track of deleted suggestions
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the debounce timeout

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map only once
      const mapInstance = L.map("map").setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      mapRef.current = mapInstance; // Save the map instance in ref
      if (selectedCoords?.lat && selectedCoords.lon && place.length > 0) {
        const { lat, lon } = selectedCoords;

        setSelectedCoords({ lat: lat, lon: lon });
        setLatitude(lat);
        setLongitude(lon);
        setPlace(place);
        setQuery(place);
        setSuggestions([]);

        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 15);

          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            const customIcon = new L.Icon({
              iconUrl: "/marker-icon-2x.png",
              iconSize: [23, 31],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            const newMarker = L.marker([lat, lon], {
              icon: customIcon,
            }).addTo(mapRef.current);
            setMarker(newMarker);
          }
        }
      }
    }
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (value) {
        try {
          setIsLoading(true);
          const response = await axios.get<LocationSuggestion[]>(
            `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`
          );
          setSuggestions(
            response.data.filter(
              (item) =>
                !deletedSuggestions.some(
                  (deleted) =>
                    deleted.lat === item.lat && deleted.lon === item.lon
                )
            )
          );
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);
  };

  const handleSuggestionClick = (place: LocationSuggestion) => {
    const { lat, lon, display_name } = place;

    setSelectedCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
    setLatitude(parseFloat(lat));
    setLongitude(parseFloat(lon));
    setPlace(display_name);
    setQuery(display_name);
    setSuggestions([]);

    if (mapRef.current) {
      mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 15);

      if (marker) {
        marker.setLatLng([parseFloat(lat), parseFloat(lon)]);
      } else {
        const customIcon = new L.Icon({
          iconUrl: "/marker-icon-2x.png",
          iconSize: [23, 31],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const newMarker = L.marker([parseFloat(lat), parseFloat(lon)], {
          icon: customIcon,
        }).addTo(mapRef.current);
        setMarker(newMarker);
      }
    }
  };

  const handleDeleteSuggestion = (place: LocationSuggestion) => {
    setDeletedSuggestions((prev) => [...prev, place]);
    setSuggestions((prev) =>
      prev.filter((item) => item.lat !== place.lat || item.lon !== place.lon)
    );
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <Card className="p-4 shadow-lg rounded-md bg-white dark:bg-gray-800">
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Pick an event location..."
            value={query}
            onChange={handleSearch}
            className="w-full dark:bg-gray-700 dark:text-white"
          />
          {query && (
            <button
              className="ml-2 text-gray-500 dark:text-white hover:animate-pulse"
              onClick={clearInput}
            >
              &#10005;
            </button>
          )}
        </div>
        {isLoading && <SkeletonLoading />}
        <ul className="mt-2 space-y-2 max-h-[200px] overflow-y-auto ">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex justify-between items-center"
            >
              {item.display_name}
              <button
                className="text-red-500 dark:text-red-400 hover:animate-pulse"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSuggestion(item);
                }}
              >
                &#10005;
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div id="map" className="h-[500px] w-full rounded-md mb-4 z-[100]"></div>

      {selectedCoords && (
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Selected Location: {place}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Latitude: {selectedCoords.lat}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Longitude: {selectedCoords.lon}
          </p>
        </div>
      )}
    </Card>
  );
};

export default EventLocationPicker;
