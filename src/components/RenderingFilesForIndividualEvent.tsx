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
  if (fileExtension === "mp4") {
    return (
      <video
        about={alt}
        className="w-full aspect-square object-cover rounded-md"
        width={250}
        height={250}
      >
        <source src={url} about={alt} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg"
  ) {
    return (
      <Image
        className="w-full aspect-square object-cover rounded-md  "
        src={url}
        alt={alt}
        about={alt}
        width={250}
        height={250}
      />
    );
  }

  return <p>Unsupported media format</p>;
};

export default RenderingFilesForIndividualEvent;
