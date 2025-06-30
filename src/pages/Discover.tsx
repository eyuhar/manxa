import ManxaCard from '@/components/ManxaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchManxaList, searchManxas } from '@/services/manxa';
import type { Manxa } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, type JSX } from 'react';

function Discover(): JSX.Element {
  // search input for controlled input
  const [searchTerm, setSearchTerm] = useState<string>("");
  // actual query that triggers api request
  const [query, setQuery] = useState<string>("");

  const isSearching = query !== "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["manxaSearch", query],
    queryFn: ({ pageParam = 1 }) =>
      isSearching ? searchManxas(query, pageParam) : fetchManxaList(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if(isSearching){
        return lastPage?.data?.results?.length === 20 ? allPages.length + 1 : undefined;
      }else{
        return lastPage?.data?.results?.length === 24 ? allPages.length + 1 : undefined;
      }
    },
    staleTime: 1000 * 60 * 10,
    initialPageParam: 1
  })

  // Trigger element for IntersectionObserver
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMoreRef, hasNextPage, fetchNextPage, isFetchingNextPage])

  // handles search button click
  const handleSearch = () => {
    setQuery(searchTerm.trim());
  };

  // handles enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Discover</h1>

      <div className="flex gap-0 w-full justify-center">
        <Input
          type="text"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="py-2 mb-5 max-w-2xl rounded-r-none focus-visible:ring-0"
        />
        <Button
          className="rounded-l-none border-l-0"
          variant="outline"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {data?.pages[0]?.data?.results && data?.pages[0]?.data?.results?.length > 0 && (
        <div className='mb-6 text-muted-foreground text-sm'>
          {data?.pages[0]?.data?.totalResults.toLocaleString("en-US")} results
        </div>
      )}      

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
            <ManxaCard key={manxa.title || `${pageIndex}-${manxa.title}`} manxa={manxa} />
          ))
        )}
      </div>

      <div ref={loadMoreRef} className="h-16 mt-5 flex justify-center items-center">
        {isFetchingNextPage &&
          <svg
            className="w-8 animate-spin fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>loading</title>
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        }
      </div>

      {!isLoading &&
        data?.pages[0]?.data?.results.length === 0 && (
          <p className="text-gray-500 mt-8">No manxas found</p>
        )}
    </div>
  );
}

export default Discover;
