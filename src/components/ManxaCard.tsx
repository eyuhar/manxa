import type { Manxa } from "@/types";
import { useState, type JSX } from "react";
import { Card, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type Props = {
  manxa: Manxa;
};

// simple card UI to display manxa cover and title
export default function ManxaCard({ manxa }: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <Card className="w-44 max-h-72 pt-0 pb-3 border-0 hover:animate-pulse gap-3 rounded-md [@media(max-width:900px)]:w-36 [@media(max-width:900px)]:max-h-60 shadow-ring">
      {isLoading && !isError && (
        <>
          <Skeleton className="h-72 overflow-hidden rounded-t-md"></Skeleton>
          <CardTitle className="font-normal text-sm pl-1 mb-0 pb-0 h-5 ">
            <Skeleton className="w-30 h-4 rounded-sm"></Skeleton>
          </CardTitle>
        </>
      )}

      {isError ? (
        <div className="w-full h-[300px] text-destructive flex items-center justify-center mb-4">
          Failed to load image
        </div>
      ) : (
        <>
          <div
            className={
              "h-72 overflow-hidden rounded-t-md" + (isLoading ? " hidden" : "")
            }
          >
            <img
              className="rounded-t-md h-full w-full object-cover hover:scale-110 transition-all ease-in-out"
              src={
                "https://manxa-backend.abrdns.com/api/image-proxy?url=" +
                encodeURIComponent(manxa.img)
              }
              alt={manxa.title}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setIsError(true);
              }}
            />
          </div>
          <CardTitle
            className={
              "font-normal text-sm pl-1 mb-0 pb-0 h-5" +
              (isLoading ? " hidden" : "")
            }
          >
            <p className="max-w-40 text-xs font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {manxa.title}
            </p>
          </CardTitle>
        </>
      )}
    </Card>
  );
}
