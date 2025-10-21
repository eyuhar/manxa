import {
  fetchChapterProgress,
  fetchManxaDex,
  fetchManxaListDex,
  markChapterAsRead,
  markChapterAsUnread,
} from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { buildUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Chapter, ManxaDetailed } from "@/types";
import ManxaCard from "@/components/ManxaCard";
import StarRating from "@/components/StarRating";
import DialogAdd from "@/components/DialogAdd";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FixedSizeList } from "react-window";
import { useMemo, useRef, type CSSProperties } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AutoSizer from "react-virtualized-auto-sizer";

export default function ManxaDetail() {
  const { id } = useParams<{ id: string }>();
  const manxaUrl = id ? buildUrl("https://api.mangadex.org/manga/", id) : "";
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();
  const scrollOffsetRef = useRef(0);

  // Set list scroll position to 0 after switching to another manxa
  // using useMemo because it triggers before rendering
  useMemo(() => {
    scrollOffsetRef.current = 0;
  }, [id]);

  // Fetch detailed information for the selected manxa
  const {
    data: ManxaDetail,
    isLoading: isLoadingManxaDetail,
    isError: isErrorManxaDetail,
  } = useQuery({
    queryKey: ["manxaDetail", manxaUrl],
    queryFn: () =>
      id ? fetchManxaDex(manxaUrl) : Promise.reject("No title provided"),
    enabled: !!id,
    retry: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // Fetch featured/trending manxas for the sidebar
  const { data: featuredManxas, isLoading: isLoadingFeaturedManxas } = useQuery(
    {
      queryKey: ["featuredManxas"],
      queryFn: () => fetchManxaListDex(1),
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  // Fetch chapter progress for the current manxa
  // This will only run if the user is authenticated and the manxaUrl is available
  const {
    data: chapterProgress,
    isError: isErrorChapterProgress,
    error: chapterProgressError,
  } = useQuery({
    queryKey: ["chapterProgress", manxaUrl],
    queryFn: () => fetchChapterProgress(token!, manxaUrl),
    enabled: !!token && !!manxaUrl,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // If chapter progress fetch fails with 401, logout the user
  // This handles cases where the token is invalid or expired
  if (
    isErrorChapterProgress &&
    chapterProgressError.message.includes("HTTP 401")
  ) {
    logout();
  }

  // Mutation to mark chapters as read
  const markChapterAsReadMutation = useMutation({
    mutationFn: (chapterUrls: string[]) => {
      const toMark = chapterUrls.map((chapterUrl) => ({
        manxa_url: manxaUrl,
        chapter_url: chapterUrl,
      }));
      return markChapterAsRead(token!, toMark);
    },
    onMutate: (variables) => {
      if (variables.length > 0) {
        toast.info("Chapters getting marked...");
      }
    },
    onSuccess: (_data, variables) => {
      // Invalidate the chapter progress query to refresh the data
      // This ensures the UI updates with the new read status
      queryClient.invalidateQueries({
        queryKey: ["chapterProgress", manxaUrl],
      });
      queryClient.invalidateQueries({
        queryKey: ["readingHistory"],
      });
      if (variables.length === 1) {
        toast.success("Chapter marked as read.");
      } else {
        toast.success("All selected chapters marked as read.");
      }
    },
    onError: (error, variables) => {
      if (variables.length === 1) {
        toast.error("Failed to mark chapter as read.");
        console.error("Error marking chapter as read:", error);
        return;
      }
      console.error("Error marking chapters as read:", error);
      toast.error("Failed to mark chapters as read.");
    },
  });

  // Mutation to mark chapters as unread
  const markChapterAsUnreadMutation = useMutation({
    mutationFn: (chapterUrls: string[]) => {
      const toUnmark = chapterUrls.map((chapterUrl) => ({
        manxa_url: manxaUrl,
        chapter_url: chapterUrl,
      }));
      return markChapterAsUnread(token!, toUnmark);
    },
    onMutate: (variables) => {
      if (variables.length > 0) {
        toast.info("Chapters getting marked...");
      }
    },
    onSuccess: (_data, variables) => {
      // Invalidate the chapter progress query to refresh the data
      // This ensures the UI updates with the new read status
      queryClient.invalidateQueries({
        queryKey: ["chapterProgress", manxaUrl],
      });
      queryClient.invalidateQueries({
        queryKey: ["readingHistory"],
      });
      if (variables.length === 1) {
        toast.success("Chapter marked as unread.");
      } else {
        toast.success("All selected chapters marked as unread.");
      }
    },
    onError: (error, variables) => {
      if (variables.length === 1) {
        toast.error("Failed to mark chapter as unread.");
        console.error("Error marking chapter as unread:", error);
        return;
      }
      console.error("Error marking chapters as unread:", error);
      toast.error("Failed to mark chapters as unread.");
    },
  });

  const manxa: ManxaDetailed = ManxaDetail?.data ?? ({} as ManxaDetailed);

  // Handle marking a chapter as read when the button is clicked
  // Prevents default link behavior and stops propagation to avoid navigating away
  function handleMarkChapterAsRead(
    chapter: Chapter,
    event: React.MouseEvent<HTMLElement>
  ) {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Prevent the link from being followed

    if (chapterProgress?.read_chapters.includes(chapter.chapterUrl)) {
      toast.info("Chapter already marked as read.");
      return;
    }

    // If the chapter is not read, mark it as read
    markChapterAsReadMutation.mutate([chapter.chapterUrl]);
  }

  // Handle marking a chapter as unread when the button is clicked
  // Prevents default link behavior and stops propagation to avoid navigating away
  function handleMarkChapterAsUnread(
    chapter: Chapter,
    event: React.MouseEvent<HTMLElement>
  ) {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Prevent the link from being followed

    if (!chapterProgress?.read_chapters.includes(chapter.chapterUrl)) {
      toast.info("Chapter already marked as unread.");
      return;
    }

    // If the chapter is not read, mark it as read
    markChapterAsUnreadMutation.mutate([chapter.chapterUrl]);
  }

  // handleMark-A(All)C(Chapters)B(Below)-AsRead
  // Handle marking all chapters below the current one as read
  function handleMarkACBAsRead(
    chapter: Chapter,
    event: React.MouseEvent<HTMLElement>
  ) {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Prevent the link from being followed

    const index = manxa.chapters.findIndex(
      (ch) => ch.chapterUrl === chapter.chapterUrl
    );

    markChapterAsReadMutation.mutate(
      manxa.chapters.slice(index).map((ch) => ch.chapterUrl)
    );
  }

  // handleMark-A(All)C(Chapters)B(Below)-AsUnread
  // Handle marking all chapters below the current one as unread
  function handleMarkACBAsUnread(
    chapter: Chapter,
    event: React.MouseEvent<HTMLElement>
  ) {
    event.preventDefault(); // Prevent default link behavior
    event.stopPropagation(); // Prevent the link from being followed

    const index = manxa.chapters.findIndex(
      (ch) => ch.chapterUrl === chapter.chapterUrl
    );

    markChapterAsUnreadMutation.mutate(
      manxa.chapters.slice(index).map((ch) => ch.chapterUrl)
    );
  }

  // Show loading spinner while manxa detail is loading
  if (isLoadingManxaDetail) {
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

  // Show error message if manxa detail fetch failed
  if (isErrorManxaDetail) {
    return (
      <div className="p-4 text-center">
        <p className="mb-3 text-accent-foreground font-semibold">
          Manxa not found
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Try searching again via the Discover page
        </p>
        <Button variant="outline" asChild>
          <Link to="/discover">Back to Discover</Link>
        </Button>
      </div>
    );
  }

  // Icons for chapter actions in separate components for performance reasons
  // These are used in the chapter list for marking chapters as read/unread
  const IconCheck = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 fill-foreground"
    >
      <title>check</title>
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
    </svg>
  );

  const IconClose = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 fill-foreground"
    >
      <title>close</title>
      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
    </svg>
  );

  const IconArrowDownThin = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 fill-foreground"
    >
      <title>arrow-down-thin</title>
      <path d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" />
    </svg>
  );

  // Chapter item component for rendering each chapter in the list
  const ChapterItem = ({
    data,
    index,
    style,
  }: {
    data: Chapter[];
    index: number;
    style: CSSProperties;
  }) => {
    const chapter = data[index];

    return (
      <Link
        to={`/manxa/${chapter.chapterUrl}`}
        className="flex w-full items-center justify-between hover:bg-accent hover:text-accent-foreground p-2 rounded-md"
        style={style}
      >
        <div>
          <CardTitle
            className={
              "font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap flex-1 " +
              (chapterProgress?.read_chapters.includes(chapter.chapterUrl)
                ? "text-muted-foreground"
                : "")
            }
          >
            {"Chapter " + chapter.chapter}
          </CardTitle>
          <CardDescription>{chapter.chapterUploadTime}</CardDescription>
        </div>
        {token && (
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-1!"
                  onClick={(event) => handleMarkChapterAsRead(chapter, event)}
                >
                  <IconCheck />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as read</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-1!"
                  onClick={(event) => handleMarkChapterAsUnread(chapter, event)}
                >
                  <IconClose />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as unread</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-0 px-1!"
                  onClick={(event) => handleMarkACBAsRead(chapter, event)}
                >
                  <IconArrowDownThin />
                  <IconCheck />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark all chapters below as read</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-0 px-1!"
                  onClick={(event) => handleMarkACBAsUnread(chapter, event)}
                >
                  <IconArrowDownThin />
                  <IconClose />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark all chapters below as unread</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </Link>
    );
  };

  // Chapter list component that uses react-window for performance
  // Displays chapters in a scrollable list with fixed item height
  function ChapterList({
    manxa,
    initialScrollOffset,
    onScroll,
  }: {
    manxa: ManxaDetailed;
    initialScrollOffset?: number;
    onScroll?: (offset: number) => void;
  }) {
    return (
      <CardContent className="max-h-[902px] [@media(max-width:900px)]:max-h-[758px] h-[900px] overflow-hidden">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              initialScrollOffset={initialScrollOffset}
              onScroll={({ scrollOffset }) => {
                onScroll!(scrollOffset);
              }}
              className="scrollbar overflow-y-auto"
              height={height}
              width={width}
              itemCount={manxa.chapters.length}
              itemSize={70}
              itemData={manxa.chapters}
              overscanCount={30}
            >
              {ChapterItem}
            </FixedSizeList>
          )}
        </AutoSizer>
      </CardContent>
    );
  }

  // Show fallback if no manxa data is available
  if (!ManxaDetail?.data) {
    return (
      <div className="p-4 text-muted-foreground">No manxa data found.</div>
    );
  }

  return (
    <div className="max-w-6xl p-4 flex flex-col">
      <div className="[@media(max-width:655px)]:flex-col flex items-center rounded-xl border-gray-200 self-center w-full">
        <div className="h-80 overflow-hidden flex shrink-0 justify-center items-center">
          <img
            className="rounded-md h-full object-cover"
            src={manxa.img}
            alt={manxa.title}
          />
        </div>
        <Card className="border-0 shadow-none min-w-80 w-full bg-background">
          <CardHeader className="flex flex-col">
            <CardTitle className="[@media(max-width:655px)]:self-center">
              {manxa.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">
                Author(s)
              </CardTitle>
              <CardDescription className="[@media(max-width:655px)]:self-center">
                {manxa.authors}
              </CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">
                Status
              </CardTitle>
              <CardDescription className="[@media(max-width:655px)]:self-center">
                {manxa.status}
              </CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">
                Last Update
              </CardTitle>
              <CardDescription className="[@media(max-width:655px)]:self-center">
                {manxa.lastUpdate}
              </CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">
                Views
              </CardTitle>
              <CardDescription className="[@media(max-width:655px)]:self-center">
                {manxa.views.toLocaleString("en-US")}
              </CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">
                Genres
              </CardTitle>
              <CardDescription className="[@media(max-width:655px)]:self-center">
                {manxa.genres.join(", ")}
              </CardDescription>
            </div>
            <div className="flex [@media(max-width:655px)]:flex-col justify-between gap-2">
              <div className="flex flex-col">
                <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">
                  Rating
                </CardTitle>
                <CardDescription className="[@media(max-width:655px)]:self-center">
                  <div className="flex items-center gap-1">
                    <div>{manxa.rating}</div>
                    <StarRating
                      rating={parseFloat(manxa.rating.split("/")[0])}
                    />
                  </div>
                </CardDescription>
              </div>
              <div className="[@media(min-width:655px)]:hidden flex flex-col">
                <CardTitle className="font-medium text-sm self-center">
                  Summary
                </CardTitle>
                <CardDescription className="wrap-anywhere">
                  {manxa.summary}
                </CardDescription>
              </div>
              <DialogAdd
                title={id!}
                className="self-end [@media(max-width:655px)]:w-full [@media(max-width:655px)]:self-center [@media(max-width:655px)]:mt-3"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="[@media(max-width:655px)]:hidden flex flex-col p-2">
        <CardTitle className="font-medium text-sm mb-2 self-center">
          Summary
        </CardTitle>
        <CardDescription className="wrap-anywhere self-center">
          {manxa.summary}
        </CardDescription>
      </div>
      <div className="flex [@media(max-width:655px)]:flex-col justify-center items-center gap-2 w-full">
        <Card className="mt-8 max-w-3xl self-start w-full">
          <CardHeader className="flex flex-col">
            <CardTitle className="self-center">Chapters</CardTitle>
          </CardHeader>
          <ChapterList
            manxa={manxa}
            initialScrollOffset={scrollOffsetRef.current}
            onScroll={(offset) => {
              scrollOffsetRef.current = offset;
            }}
          />
        </Card>
        <Card className="mt-8 max-w-[220px] [@media(max-width:655px)]:max-w-full w-full border-0 shadow-none bg-background">
          <CardHeader className="flex flex-col">
            <CardTitle className="self-center mb-2">Trending</CardTitle>
          </CardHeader>
          <CardContent className="flex [@media(min-width:655px)]:flex-col self-center">
            {isLoadingFeaturedManxas ? (
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
            ) : featuredManxas?.data?.results?.length &&
              featuredManxas?.data?.results?.length > 0 ? (
              <div className="flex [@media(min-width:655px)]:flex-col justify-center flex-wrap gap-4">
                {featuredManxas?.data.results
                  .slice(0, 3)
                  .map((manxa, index) => (
                    <Link to={`/manxa/${manxa.url}`} key={index}>
                      <ManxaCard manxa={manxa} />
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="p-4 text-muted-foreground">
                No trending manxas found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
