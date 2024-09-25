"use client";
import { useEffect, useState } from "react";
import { hero1 } from "@/assets/hero";
import Image, { StaticImageData } from "next/image";

const MediaRenderer = ({ url, alt }: { url: string; alt: string }) => {
  const [validUrl, setValidUrl] = useState<string | StaticImageData | null>(
    null
  );
  const placeholderUrl: StaticImageData = hero1; // Your default placeholder image URL

  // Extract file extension
  const fileExtension = url.split(".").pop()?.toLowerCase();

  useEffect(() => {
    const validateImage = async (imageUrl: string) => {
      try {
        const response = await fetch(imageUrl, { method: "HEAD" });
        if (
          response.ok &&
          response.headers.get("content-type")?.startsWith("image")
        ) {
          setValidUrl(imageUrl);
        } else {
          setValidUrl(placeholderUrl);
        }
      } catch (error) {
        setValidUrl(placeholderUrl); // Fallback to placeholder if the URL is invalid
      }
    };

    if (!fileExtension || !url) {
      setValidUrl(placeholderUrl);
    } else if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg"
    ) {
      validateImage(url);
    } else {
      setValidUrl(url); // Handle videos and other formats
    }
  }, [url, fileExtension, placeholderUrl]);

  const getStringUrl = (input: string | StaticImageData): string =>
    typeof input === "string" ? input : input.src;

  // Render based on file extension
  if (fileExtension === "mp4") {
    return (
      <video
        about={alt}
        className="w-full aspect-video object-cover rounded-md"
        width={500}
        height={500}
        controls
      >
        <source
          src={getStringUrl(validUrl || placeholderUrl)}
          about={alt}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (
    validUrl &&
    (fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg")
  ) {
    return (
      <Image
        className="w-full aspect-video object-cover rounded-md"
        src={getStringUrl(validUrl)}
        alt={alt}
        about={alt}
        width={500}
        height={500}
      />
    );
  }

  return <p>Getting image...</p>;
};

export default MediaRenderer;
