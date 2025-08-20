import { useAuth } from "@/contexts/AuthContext";
import { extractSlug } from "@/lib/utils";
import { fetchHistory, fetchManxa } from "@/services/api";
import type { ManxaDetailed } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo, type JSX } from "react";
import { Link } from "react-router-dom";

function History(): JSX.Element {
  const { token } = useAuth();

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

  const manxaQueries = useQueries({
    queries: uniqueManxaUrls.map((manxaUrl) => ({
      queryKey: ["manxaDetail", manxaUrl],
      queryFn: () => fetchManxa(manxaUrl),
      enabled: !!manxaUrl,
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });

  const manxaMap = useMemo(() => {
    const map = new Map<string, ManxaDetailed>();
    uniqueManxaUrls.forEach((url, i) => {
      const data = manxaQueries[i]?.data;
      map.set(url, data?.data!);
    });
    return map;
  }, [uniqueManxaUrls, manxaQueries]);

  if (isLoadingHistoryData || manxaQueries[manxaQueries.length - 1].isLoading) {
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

  if (isErrorHistoryData || !historyData) {
    return (
      <div className="p-4 text-muted-foreground">No reading history found.</div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 w-full max-w-3xl mt-5 text-foreground">
      {[...historyData.history].map((historyItem) => (
        <li
          key={historyItem.chapter_url}
          className="flex gap-2 w-full p-1 shadow-sm rounded-lg shadow-border bg-card border"
        >
          <div className="flex gap-2 p-1 w-full justify-between">
            <div className="flex gap-2">
              <Link
                to={`/manxa/${extractSlug(
                  historyItem.manxa_url,
                  "https://www.mangakakalot.gg/manga/"
                )}`}
                className="rounded min-w-14"
              >
                <img
                  src={
                    "http://52.59.130.106/api/image-proxy?url=" +
                    encodeURIComponent(
                      manxaMap.get(historyItem.manxa_url)?.img!
                    )
                  }
                  alt=""
                  className="rounded h-20 "
                />
              </Link>
              <div className="flex flex-col">
                <p className="font-medium text-sm overflow-ellipsis hover:underline">
                  <Link
                    to={`/manxa/${extractSlug(
                      historyItem.manxa_url,
                      "https://www.mangakakalot.gg/manga/"
                    )}`}
                    className="rounded min-w-14"
                  >
                    {manxaMap.get(historyItem.manxa_url)?.title}
                  </Link>
                </p>
                <p className="text-sm hover:underline">
                  <Link
                    to={`/manxa/${extractSlug(
                      historyItem.chapter_url,
                      "https://www.mangakakalot.gg/manga/"
                    )}`}
                    className="rounded min-w-14"
                  >
                    {"C" +
                      extractSlug(
                        historyItem.chapter_url,
                        "https://www.mangakakalot.gg/manga/" +
                          extractSlug(
                            historyItem.manxa_url,
                            "https://www.mangakakalot.gg/manga/"
                          )
                      ).slice(1)}
                  </Link>
                </p>
                <p className="text-sm [@media(min-width:655px)]:hidden">
                  {historyItem.read_at}
                </p>
              </div>
            </div>
            <div className="[@media(max-width:655px)]:hidden">
              <p className="text-sm">{historyItem.read_at}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default History;
