"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const RenderingFilesForIndividualEvent = ({
  url,
  alt,
}: {
  url: string;
  alt: string;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract file extension
  const fileExtension = url.split(".").pop()?.toLowerCase();
  if (!fileExtension) {
    return <p>Invalid URL</p>;
  }

  if (!isClient) {
    return null;
  }

  // Render based on file extension
  if (
    fileExtension === "mp4" ||
    fileExtension === "webm" ||
    fileExtension === "ogg" ||
    fileExtension === "mov" ||
    fileExtension === "avi" ||
    fileExtension === "mkv"
  ) {
    return (
      <video
        about={alt}
        className="w-full aspect-square object-cover rounded-md"
        width={100}
        height={100}
      >
        <source src={url} about={alt} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "webp"
  ) {
    return (
      <Image
        className=" w-full aspect-square object-cover rounded-md  "
        src={url}
        draggable={false}
        alt={alt}
        about={alt}
        width={100}
        height={100}
      />
    );
  }

  return <p>Unsupported media format</p>;
};

export default RenderingFilesForIndividualEvent;
