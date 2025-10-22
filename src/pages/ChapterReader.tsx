import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchChapterImageUrlsDex, fetchManxaDex } from "@/services/api";
import ChapterImage from "@/components/ChapterImage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Minus, Plus } from "lucide-react";

type ZoomLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const widthClasses: Record<ZoomLevel, string> = {
  1: "w-[10%]",
  2: "w-[20%]",
  3: "w-[30%]",
  4: "w-[40%]",
  5: "w-[50%]",
  6: "w-[60%]",
  7: "w-[70%]",
  8: "w-[80%]",
  9: "w-[90%]",
  10: "w-[100%]",
};

export default function ChapterReader() {
  const { manxaId, chapterId, chapter } = useParams<{
    manxaId: string;
    chapterId: string;
    chapter: string;
  }>();
  const chapterUrl = `https://api.mangadex.org/at-home/server/${chapterId}`;
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(5); // Default zoom level

  const {
    data: imageUrls,
    isLoading: isLoadingImageUrls,
    isError: isErrorImageUrls,
  } = useQuery({
    queryKey: ["chapterImageUrls", chapterUrl],
    queryFn: () => fetchChapterImageUrlsDex(chapterUrl),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const {
    data: manxaInfo,
    isLoading: isLoadingManxaInfo,
    isError: isErrorManxaInfo,
  } = useQuery({
    queryKey: ["manxaDetail", `https://api.mangadex.org/manga/${manxaId}`],
    queryFn: () =>
      manxaId
        ? fetchManxaDex(`https://api.mangadex.org/manga/${manxaId}`)
        : Promise.reject("No title provided"),
    enabled: !!manxaId,
    retry: false,
  });

  if (isLoadingImageUrls || isLoadingManxaInfo) {
    return (
      <div className="p-4 flex items-center justify-center h-screen">
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

  if (isErrorImageUrls || !imageUrls) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] p-8 text-center text-destructive">
        <p>Failed to load chapter content.</p>
        <p className="text-muted-foreground mt-2">
          Try again later or return to the manxa page.
        </p>
      </div>
    );
  }

  function nextChapter() {
    if (!manxaInfo || !manxaInfo.data || !manxaInfo.data.chapters) {
      return null;
    }
    const chapters = manxaInfo.data.chapters;
    const currentIndex = chapters.findIndex(
      (ch) => ch.chapterUrl === chapterUrl
    );
    if (currentIndex === -1 || currentIndex === chapters.length - 1) {
      return null; // No next chapter available
    }
    const nextChapter = chapters[currentIndex + 1];
    return nextChapter;
  }

  function previousChapter() {
    if (!manxaInfo || !manxaInfo.data || !manxaInfo.data.chapters) {
      return null;
    }
    const chapters = manxaInfo.data.chapters;
    const currentIndex = chapters.findIndex(
      (ch) => ch.chapterUrl === chapterUrl
    );
    if (currentIndex <= 0) {
      return null; // No previous chapter available
    }
    const prevChapter = chapters[currentIndex - 1];
    return prevChapter;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="p-1 font-bold mb-6 capitalize text-center w-">
        {chapter}
      </h1>
      <div className="flex mb-5 gap-2 bg-background p-1 rounded-b-sm">
        {isErrorManxaInfo
          ? null
          : (() => {
              const next = nextChapter();
              return next ? (
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Link
                    to={`/manxa/${manxaId}/${next.chapterUrl.split("/")[5]}/${
                      manxaInfo!.data.title + " Chapter " + next.chapter
                    }`}
                  >
                    Previous
                  </Link>
                </Button>
              ) : null;
            })()}

        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            setZoomLevel((prev) => Math.max(1, prev - 1) as ZoomLevel)
          }
        >
          <Minus />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            setZoomLevel((prev) => Math.min(10, prev + 1) as ZoomLevel)
          }
        >
          <Plus />
        </Button>

        {isErrorManxaInfo
          ? null
          : (() => {
              const prev = previousChapter();
              return prev ? (
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Link
                    to={`/manxa/${manxaId}/${prev.chapterUrl.split("/")[5]}/${
                      manxaInfo!.data.title + " Chapter " + prev.chapter
                    }`}
                  >
                    Next
                  </Link>
                </Button>
              ) : null;
            })()}
      </div>

      {imageUrls.data.map((imageUrl, index) => (
        <ChapterImage
          className={widthClasses[zoomLevel]}
          key={index}
          imageUrl={imageUrl}
          index={index}
        />
      ))}

      <div className="flex mb-5 mt-10 gap-2 bg-background p-1 rounded-b-sm">
        {isErrorManxaInfo
          ? null
          : (() => {
              const next = nextChapter();
              return next ? (
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Link
                    to={`/manxa/${manxaId}/${next.chapterUrl.split("/")[5]}//${
                      manxaInfo!.data.title + " Chapter " + next.chapter
                    }`}
                  >
                    Previous
                  </Link>
                </Button>
              ) : null;
            })()}

        {isErrorManxaInfo
          ? null
          : (() => {
              const prev = previousChapter();
              return prev ? (
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Link
                    to={`/manxa/${manxaId}/${prev.chapterUrl.split("/")[5]}//${
                      manxaInfo!.data.title + " Chapter " + prev.chapter
                    }`}
                  >
                    Next
                  </Link>
                </Button>
              ) : null;
            })()}
      </div>

      <ScrollToTopButton className="fixed bottom-2 right-2" />
    </div>
  );
}
