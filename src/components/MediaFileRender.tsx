"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { CrownIcon } from "lucide-react";
import "react-medium-image-zoom/dist/styles.css";
import Zoom from "react-medium-image-zoom";
import { cn } from "@/lib/utils";

const MediaRenderer = ({
  url,
  alt,
  onPlay,
  onPause,
  onEnded,
  featured,
  className,
  isEagerLoad,
}: {
  url: string;
  alt: string;
  featured?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  isEagerLoad?: boolean;

  className?: string;
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
        className={cn(
          "w-full aspect-video object-cover rounded-md h-auto",
          className
        )}
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
        <article className="  overflow-hidden  rounded-lg my-2 w-full cursor-zoom-in">
          <Zoom>
            <Image
              src={url}
              alt={alt}
              width={500}
              height={300}
              className={cn(
                "rounded-md   object-cover w-full h-auto",
                className
              )}
              sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading={"lazy"}
            />
          </Zoom>
        </article>
      </div>
    );
  }
  return <p>Unsupported media format</p>;
};

export default MediaRenderer;
