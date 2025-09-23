import { type JSX } from "react";
import { useState } from "react";

export default function ChapterImage({
  imageUrl,
  index,
  className,
}: {
  imageUrl: string;
  index: number;
  className?: string;
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <>
      {isLoading && !isError && (
        <div className="p-4 h-[720px] flex items-center justify-center">
          <svg
            className="w-8 animate-spin fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>loading</title>
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        </div>
      )}

      {isError ? (
        <div className="w-full h-[300px] text-destructive flex items-center justify-center mb-4">
          Failed to load image {index + 1}
        </div>
      ) : (
        <img
          src={
            "https://manxa-backend.abrdns.com/api/image-proxy?url=" +
            encodeURIComponent(imageUrl)
          }
          alt={`Page ${index + 1}`}
          className={`${className} ${isLoading ? "hidden" : ""}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setIsError(true);
          }}
        />
      )}
    </>
  );
}
