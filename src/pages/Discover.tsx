import ManxaCard from "@/components/ManxaCard";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchManxaListDex, searchManxasDex } from "@/services/api";
import type { Manxa } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type JSX } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Discover(): JSX.Element {
  // URL search parameter (e.g., ?q=berserk)
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  // search input for controlled input
  const [searchTerm, setSearchTerm] = useState<string>(queryParam);

  const isSearching = queryParam !== "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["manxaSearch", queryParam],
    queryFn: ({ pageParam = 1 }) =>
      isSearching
        ? searchManxasDex(queryParam, pageParam)
        : fetchManxaListDex(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (isSearching) {
        return lastPage?.data?.results?.length === 24
          ? allPages.length + 1
          : undefined;
      } else {
        return lastPage?.data?.results?.length === 24
          ? allPages.length + 1
          : undefined;
      }
    },
    staleTime: 1000 * 60 * 10,
    initialPageParam: 1,
  });

  // Trigger element for IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Sync input when URL param changes
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  // handles search button click
  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  // handles enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // "Show all" -> removes q param
  const handleShowAll = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 w-full justify-center">
        <Button
          variant="outline"
          className="ml-3 cursor-pointer"
          onClick={handleShowAll}
        >
          Show all
        </Button>
        <Input
          name="search"
          type="text"
          autoComplete="off"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="py-2 mb-5 max-w-17 mr-3 focus-visible:ring-0 text-sm focus:max-w-2xl overflow-hidden transition-[max-width] duration-1000 ease-in-out cursor-pointer focus:cursor-text"
        />
      </div>

      {isLoading && (
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
      )}

      {isError && <p className="text-red-500">Failed to load manxas.</p>}

      <div className="flex flex-wrap gap-8 max-w-6xl items-center justify-center">
        {data?.pages.map((page, pageIndex) =>
          page.data.results.map((manxa: Manxa) => (
            <Link
              to={`/manxa/${manxa.url.split("/").pop()}`}
              key={`${pageIndex}-${manxa.title}`}
            >
              <ManxaCard manxa={manxa} />
            </Link>
          ))
        )}
      </div>

      <div
        ref={loadMoreRef}
        className="h-16 mt-5 flex justify-center items-center"
      >
        {isFetchingNextPage && (
          <svg
            className="w-8 animate-spin fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>loading</title>
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        )}
      </div>

      {!isLoading && data?.pages[0]?.data?.results.length === 0 && (
        <p className="text-muted-foreground mt-8">No manxas found</p>
      )}

      <ScrollToTopButton className="fixed bottom-5 right-5" />
    </div>
  );
}

export default Discover;
