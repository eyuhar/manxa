import { useQuery } from "@tanstack/react-query";
import { fetchImageAsBlobUrl } from "@/services/api";
import type { JSX } from "react";

export default function ChapterImage({imageUrl, index, className}: {imageUrl: string, index: number, className?: string}): JSX.Element {

    const {
        data: blobUrl,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["chapterImage", imageUrl],
        queryFn: () => fetchImageAsBlobUrl(imageUrl),
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    if (isLoading) {
        return (
            <div className="p-4 flex items-center justify-center">
                <svg
                    className="w-8 animate-spin fill-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <title>loading</title>
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
            </div>
        );
    }

    if (isError || !blobUrl) {
        return (
            <div className="w-full h-[300px] text-destructive flex items-center justify-center mb-4">
                Failed to load image {index + 1}
            </div>
        );
    }

    return (
        <img
            src={blobUrl}
            alt={`Page ${index + 1}`}
            className={className}
        />
    );
}