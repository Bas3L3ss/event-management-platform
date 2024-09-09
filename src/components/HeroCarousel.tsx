"use client";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { hero1, hero2, hero3 } from "@/assets/hero";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

Autoplay.globalOptions = { delay: 3000 };

export function HeroCarousel() {
  const images = [hero1, hero2, hero3];
  const [emblaRef] = useEmblaCarousel({ loop: true }, []);
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      ref={emblaRef}
      className="w-full   top-0 left-0 absolute aspect-square"
    >
      <CarouselContent>
        {images.map((el) => {
          return (
            <CarouselItem key={`${el}`}>
              <Image
                className="w-full aspect-square   object-cover  "
                alt={`${el}`}
                src={el}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
