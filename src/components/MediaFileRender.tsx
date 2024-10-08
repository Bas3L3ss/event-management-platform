"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MediaRenderer = ({
  url,
  alt,
  onPlay,
  onPause,
  onEnded,
}: {
  url: string;
  alt: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure the component only renders on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract file extension
  const fileExtension = url.split(".").pop()?.toLowerCase();
  if (!fileExtension) {
    return <p>Invalid URL</p>;
  }

  if (!isClient) {
    // Prevent SSR from causing hydration issues
    return null;
  }

  // Render based on file extension
  if (fileExtension === "mp4") {
    return (
      <video
        className="w-full aspect-video object-cover rounded-md"
        width={500}
        height={500}
        controls
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      >
        <source src={url} type="video/mp4" />
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
        className=" w-full aspect-video object-cover rounded-md transition-transform duration-300 hover:scale-105"
        src={url}
        alt={alt}
        width={500}
        height={500}
      />
    );
  }

  return <p>Unsupported media format</p>;
};

export default MediaRenderer;
