// // "use client";
// // import React, { useState } from "react";
// // import MediaRenderer from "./MediaFileRender";
// // import { removeDuplicates } from "@/utils/utils";
// // import { Button } from "./ui/button";
// // import RenderingFilesForIndividualEvent from "./RenderingFilesForIndividualEvent";
// // import Slider, { Settings } from "react-slick";

// // type EventRecordsDisplayProps = {
// //   eventImgOrVideoFirstDisplay: string;
// //   images: string[];

// //   video: string;
// //   eventName: string;
// // };
// // const settings: Settings = {
// //   speed: 500,
// //   initialSlide: 0,
// //   slidesToShow: 6,
// //   slidesToScroll: 1,
// //   arrows: false,
// //   autoplay: true,
// //   autoplaySpeed: 5000,
// // };

// // function EventRecordsDisplay({
// //   eventImgOrVideoFirstDisplay,
// //   video,
// //   images,
// //   eventName,
// // }: EventRecordsDisplayProps) {
// //   const [imagesArr, setImagesArr] = useState<string[]>(
// //     removeDuplicates([eventImgOrVideoFirstDisplay, video, ...images])
// //   );
// //   const [showIndex, setShowIndex] = useState<number>(0);
// //   console.log(imagesArr);

// //   return (
// //     <div>
// //       <div className="relative rounded-lg overflow-hidden shadow-custom  h-min ">
// //         <MediaRenderer alt={eventName} url={images[showIndex]} />
// //       </div>

// //       <Slider {...settings} className="relative -mx-2">
// //         {imagesArr.map((image, index) => {
// //           return (
// //             <div key={index}>
// //               <Button
// //                 asChild
// //                 onClick={() => {
// //                   setShowIndex(index);
// //                 }}
// //               >
// //                 <span className="">
// //                   <RenderingFilesForIndividualEvent
// //                     alt={eventName}
// //                     url={image}
// //                   />
// //                 </span>
// //               </Button>
// //             </div>
// //           );
// //         })}
// //       </Slider>
// //     </div>
// //   );
// // }

// // export default EventRecordsDisplay;

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import MediaRenderer from "./MediaFileRender";
// import { removeDuplicates } from "@/utils/utils";
// import { Button } from "./ui/button";
// import RenderingFilesForIndividualEvent from "./RenderingFilesForIndividualEvent";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// type EventRecordsDisplayProps = {
//   eventImgOrVideoFirstDisplay: string;
//   images: string[];
//   video: string;
//   eventName: string;
// };

// function EventRecordsDisplay({
//   eventImgOrVideoFirstDisplay,
//   video,
//   images,
//   eventName,
// }: EventRecordsDisplayProps) {
//   const [imagesArr, setImagesArr] = useState<string[]>(
//     removeDuplicates([eventImgOrVideoFirstDisplay, video, ...images])
//   );
//   const [showIndex, setShowIndex] = useState<number>(0);
//   const [isHovering, setIsHovering] = useState<boolean>(false);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);

//   const nextSlide = useCallback(() => {
//     setShowIndex((prevIndex) => (prevIndex + 1) % imagesArr.length);
//   }, [imagesArr.length]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isHovering && !isPlaying) {
//         nextSlide();
//       }
//     }, 6000);

//     return () => clearInterval(interval);
//   }, [isHovering, isPlaying, nextSlide]);

//   const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 6,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 4,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToScroll: 1,

//           slidesToShow: 2,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="space-y-4">
//       <div
//         className="relative rounded-lg overflow-hidden shadow-lg aspect-w-16 aspect-h-9"
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//       >
//         <MediaRenderer
//           alt={eventName}
//           url={imagesArr[showIndex]}
//           onPlay={() => setIsPlaying(true)}
//           onPause={() => setIsPlaying(false)}
//           onEnded={() => setIsPlaying(false)}
//         />
//       </div>

//       <div className="px-4">
//         <Slider {...settings}>
//           {imagesArr.map((image, index) => (
//             <div key={index} className="px-1">
//               <Button
//                 variant="outline"
//                 className={`w-full h-full relative p-1 ${
//                   showIndex === index ? "ring-2 ring-primary" : ""
//                 }`}
//                 onClick={() => setShowIndex(index)}
//               >
//                 <RenderingFilesForIndividualEvent
//                   alt={`${eventName} thumbnail ${index + 1}`}
//                   url={image}
//                 />
//               </Button>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// }

// export default EventRecordsDisplay;
"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  const nextSlide = useCallback(() => {
    setShowIndex((prevIndex) => (prevIndex + 1) % imagesArr.length);
  }, [imagesArr.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering && !isPlaying) {
        nextSlide();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovering, isPlaying, nextSlide]);

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

      <div className="w-full overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {imagesArr.map((image, index) => (
            <Button
              key={index}
              variant="outline"
              className={`flex-shrink-0 w-16 h-16 p-0.5 `}
              onClick={() => setShowIndex(index)}
            >
              <span
                className={`${
                  showIndex === index ? "ring-2 ring-primary rounded-md" : ""
                }`}
              >
                <RenderingFilesForIndividualEvent
                  alt={`${eventName} thumbnail ${index + 1}`}
                  url={image}
                />
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventRecordsDisplay;
