"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { CrownIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

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
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative cursor-zoom-in">
              <Image
                className="w-full aspect-video object-cover rounded-md transition-transform duration-300"
                src={url}
                alt={alt}
                width={500}
                height={500}
              />
            </div>
          </DialogTrigger>

          {/* Dialog content (zoomed image view) */}
          <DialogContent className=" z-[99999999999999] bg-black/50 rounded-md p-4 max-w-full max-h-full flex justify-center items-center">
            <Image
              className="object-contain max-w-full max-h-screen"
              src={url}
              alt={alt}
              width={1000}
              height={1000}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return <p>Unsupported media format</p>;
};

export default MediaRenderer;
