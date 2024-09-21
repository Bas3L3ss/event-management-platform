"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface ImagesAndVideoInputForEditPageProps {
  existingImages: string[]; // Array of existing image URLs
  existingVideo?: string | null; // URL of existing video
}

const ImagesAndVideoInputForEditPage: React.FC<
  ImagesAndVideoInputForEditPageProps
> = ({ existingImages, existingVideo }) => {
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  useEffect(() => {
    // Set existing files in state
    setImages(existingImages.map((url) => new File([], url))); // Placeholder for File object
    setVideo(existingVideo ? new File([], existingVideo) : null); // Placeholder for File object
  }, [existingImages, existingVideo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVideo(files[0]);
    }
  };

  return (
    <>
      <div className="mb-5">
        <Input
          className="mb-2"
          type="file"
          name="image"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="flex gap-4 flex-wrap">
          {existingImages.map((img, index) => (
            <Image
              width={250}
              height={250}
              key={index}
              src={img}
              alt={`Existing Image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Input
        name="video"
        className="mb-2"
        type="file"
        onChange={handleVideoChange}
        accept="video/*"
      />
      {existingVideo && (
        <video width={250} height={250} src={existingVideo} controls />
      )}
    </>
  );
};

export default ImagesAndVideoInputForEditPage;
