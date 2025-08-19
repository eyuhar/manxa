import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, type JSX } from "react";
import { BookOpenText, LibraryBig, Trophy, Star, Clock } from "lucide-react";
import GenreChart from "@/components/GenreChart";
import { useAuth } from "@/contexts/AuthContext";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchHistory, fetchManxa } from "@/services/api";
import type { HistoryElement } from "@/types";
import { capitalizeFirstLetter, extractSlug } from "@/lib/utils";

function getMostReadManxa(history: HistoryElement[]): string | null {
  if (history.length === 0) return null;

  // Object to store how many times each manxa_url appears
  const counts: Record<string, number> = {};

  // Count occurrences of each manxa_url
  history.forEach((entry) => {
    counts[entry.manxa_url] = (counts[entry.manxa_url] || 0) + 1;
  });

  // Variables to track the most read manxa_url
  let mostRead: string | null = null;
  let maxCount = 0;

  // Find the manxa_url with the highest count
  for (const [url, count] of Object.entries(counts)) {
    if (count > maxCount) {
      mostRead = url;
      maxCount = count;
    }
  }

  return mostRead;
}

function Profile(): JSX.Element {
  const { user, token } = useAuth();

  // fetch reading history data
  const {
    data: historyData,
    isLoading: isLoadingHistoryData,
    isError: isErrorHistoryData,
  } = useQuery({
    queryKey: ["readingHistory"],
    queryFn: () => fetchHistory(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 15, // 15 min
  });

  // get unique manxa urls from list of chapters
  const uniqueManxaUrls = historyData
    ? Array.from(new Set(historyData.history.map((item) => item.manxa_url)))
    : [];

  // for each of these unique manxas fetch detailed manxa information
  const manxaQueries = useQueries({
    queries: uniqueManxaUrls.map((manxaUrl) => ({
      queryKey: ["manxaDetail", manxaUrl],
      queryFn: () => fetchManxa(manxaUrl),
      enabled: !!manxaUrl,
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });

  // Compute aggregated genre data from all fetched manxa details
  // This memoized calculation will only re-run when `manxaQueries` changes
  // returns an array of objects with name/value pairs
  const genreData = useMemo(() => {
    const genreCount: Record<string, number> = {};

    manxaQueries.forEach((query) => {
      if (query.data?.success) {
        query.data.data.genres.forEach((genre) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [manxaQueries]);

  const isLoadingGenreData = manxaQueries.some((q) => q.isLoading);

  // small component to show if no data is found
  const NoDataFound: React.FC = () => {
    return (
      <div className="w-full flex items-center justify-center text-muted-foreground text-sm">
        <span>No Data Found.</span>
      </div>
    );
  };

  // loading screen if history data is till loading
  if (isLoadingHistoryData) {
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

  // error message when fetching history data fails
  if (isErrorHistoryData) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground text-sm">
        <p>Failed to laod data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full p-1">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] w-full gap-3 p-1">
        <Card className="min-w-25 flex flex-row gap-2 justify-center px-3 shadow-border">
          <CardHeader className="flex flex-col items-center justify-center ml-3">
            <Skeleton className="rounded-full w-7 h-7"></Skeleton>
            <Skeleton className="h-15 w-12 rounded-t-2xl"></Skeleton>
          </CardHeader>
          <CardContent className="flex flex-col">
            <CardTitle className="text-sm">Name</CardTitle>
            <CardDescription>{user?.user_name}</CardDescription>
            <CardTitle className="text-sm">Email</CardTitle>
            <CardDescription className="w-full wrap-anywhere">
              {user?.email}
            </CardDescription>
            <CardTitle className="text-sm mt-1">Member since</CardTitle>
            <CardDescription>{user?.created_at}</CardDescription>
          </CardContent>
        </Card>

        <Card className="justify-center items-center gap-3 p-6 w-[100%] shadow-border">
          <CardTitle className="text-sm flex gap-1 items-center">
            <Trophy className="text-foreground" size={20} />
            Top 3 Genres
          </CardTitle>
          <CardDescription className="text-md h-full flex justify-center items-center">
            {!isLoadingGenreData && genreData.length === 0 ? (
              <NoDataFound />
            ) : (
              <ul>
                {[...genreData]
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 3)
                  .map((g, i) => (
                    <li key={i}>
                      {i + 1}. {g.name}
                    </li>
                  ))}
              </ul>
            )}
          </CardDescription>
        </Card>

        <Card className=" items-center gap-3 p-6 w-[100%] shadow-border">
          <CardTitle className="text-sm flex gap-1 items-center">
            <Clock className="text-foreground" size={20} />
            Last Activity
          </CardTitle>
          <CardDescription className="text-md h-full flex justify-center items-center">
            {!isLoadingGenreData && genreData.length === 0 ? (
              <NoDataFound />
            ) : (
              historyData?.history[0].read_at
            )}
          </CardDescription>
        </Card>

        <Card className="justify-center items-center gap-3 p-6 w-[100%] shadow-border">
          <CardTitle className="text-sm flex gap-1 items-center">
            <LibraryBig className="text-foreground" size={20} />
            Manxa Read
          </CardTitle>
          <CardDescription className="text-md h-full flex justify-center items-center">
            {uniqueManxaUrls.length}
          </CardDescription>
        </Card>

        <Card className="justify-center items-center gap-3 p-6 w-[100%] shadow-border">
          <CardTitle className="text-sm flex gap-1 items-center">
            <BookOpenText className="text-foreground" size={20} />
            Chapter Read
          </CardTitle>
          <CardDescription className="text-md h-full flex justify-center items-center">
            {historyData?.history.length}
          </CardDescription>
        </Card>

        <Card className="justify-center items-center gap-3 p-6 w-[100%] shadow-border">
          <CardTitle className="text-sm flex gap-1 items-center">
            <Star className="text-foreground" size={20} />
            Most Read Manxa
          </CardTitle>
          <CardDescription className="text-md h-full flex justify-center items-center wrap-anywhere">
            {capitalizeFirstLetter(
              extractSlug(
                getMostReadManxa(historyData?.history!)!,
                "https://www.mangakakalot.gg/manga/"
              )
            )}
          </CardDescription>
        </Card>
      </div>
      <Card className="m-1 mt-2 shadow-border">
        <CardHeader className="w-full justify-center">
          <CardTitle className="text-sm">Genre Distribution</CardTitle>
        </CardHeader>
        <CardContent className="w-full p-0 min-h-80">
          {isLoadingGenreData ? (
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
          ) : (
            <GenreChart data={genreData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
