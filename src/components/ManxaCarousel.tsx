import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Manxa } from "../types";
import type { JSX } from "react";
import ManxaCardDetailed from "./ManxaCardDetailed";
import Autoplay from "embla-carousel-autoplay";

type Props = {
  manxas: Manxa[];
};

export default function ManxaCarousel({ manxas }: Props): JSX.Element {
  return (
    <Carousel
      className="max-w-6xl w-[90%]"
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnMouseEnter: true,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent>
        {manxas.map((manxa: Manxa, i: number) => (
          <CarouselItem key={i}>
            <ManxaCardDetailed url={manxa.url}></ManxaCardDetailed>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="[@media(max-width:900px)]:hidden" />
      <CarouselNext className="[@media(max-width:900px)]:hidden" />
    </Carousel>
  );
}
