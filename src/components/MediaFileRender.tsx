"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { CrownIcon } from "lucide-react";
import "react-medium-image-zoom/dist/styles.css";
import Zoom from "react-medium-image-zoom";

const MediaRenderer = ({
  url,
  alt,
  onPlay,
  onPause,
  onEnded,
  featured,
}: {
  url: string;
  alt: string;
  featured?: boolean;
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
        className="w-full aspect-video object-cover rounded-md h-[200px]"
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
    fileExtension === "jpeg" ||
    fileExtension === "webp"
  ) {
    return (
      <div className="relative">
        {featured && (
          <Badge className="hover:bg-yellow-300 bg-yellow-400 absolute top-3 left-3">
            <CrownIcon />
          </Badge>
        )}

        {/* Trigger the dialog to open on image click */}
        <article className="  overflow-hidden   max-h-64 rounded-lg my-2 w-full cursor-zoom-in">
          <Zoom>
            <Image
              src={url}
              alt="Message Image"
              width={500}
              height={500}
              className="rounded-md   object-cover w-full h-[200px]"
              loading="lazy"
            />
          </Zoom>
        </article>
      </div>
    );
  }

  return <p>Unsupported media format</p>;
};

export default MediaRenderer;
