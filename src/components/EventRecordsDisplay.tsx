"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import MediaRenderer from "./MediaFileRender";
import { removeDuplicates } from "@/utils/utils";
import { Button } from "./ui/button";
import RenderingFilesForIndividualEvent from "./RenderingFilesForIndividualEvent";

type EventRecordsDisplayProps = {
  eventImgOrVideoFirstDisplay: string;
  images: string[];
  video: string;
  eventName: string;
};

function EventRecordsDisplay({
  eventImgOrVideoFirstDisplay,
  video,
  images,
  eventName,
}: EventRecordsDisplayProps) {
  const [imagesArr, setImagesArr] = useState<string[]>(
    removeDuplicates([eventImgOrVideoFirstDisplay, video, ...images])
  );
  const [showIndex, setShowIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setShowIndex((prevIndex) => (prevIndex + 1) % imagesArr.length);
  }, [imagesArr.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering && !isPlaying) {
        nextSlide();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isHovering, isPlaying, nextSlide]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (thumbnailContainerRef.current?.offsetLeft || 0));
    setScrollLeft(thumbnailContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (thumbnailContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div
        className="relative rounded-lg overflow-hidden shadow-lg aspect-w-16 aspect-h-9 mb-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <MediaRenderer
          alt={eventName}
          url={imagesArr[showIndex]}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      <div
        ref={thumbnailContainerRef}
        className="w-full overflow-x-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex space-x-2 pb-2 w-max">
          {imagesArr.map((image, index) => (
            <Button
              key={index}
              variant="outline"
              className={`flex-shrink-0 w-16 h-16 p-0.5 ${
                showIndex === index ? "border-primary border-2" : ""
              }`}
              onClick={() => setShowIndex(index)}
            >
              <RenderingFilesForIndividualEvent
                alt={`${eventName} thumbnail ${index + 1}`}
                url={image}
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventRecordsDisplay;
