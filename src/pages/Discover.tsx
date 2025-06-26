import ManxaCard from '@/components/ManxaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchManxaList, searchManxas } from '@/services/manxa';
import type { Manxa } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useState, type JSX } from 'react';

function Discover(): JSX.Element {
  // search input for controlled input
  const [searchTerm, setSearchTerm] = useState<string>("");
  // actual query that triggers api request
  const [page, setPage] = useState<number>(1);
  // current page number
  const [query, setQuery] = useState<string>("");

  const isSearching = query.trim() !== "";

  // React Query handles API request with caching
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["manxaSearch", query, page],
    queryFn: () =>
      isSearching
        ? searchManxas(query, page)
        : fetchManxaList(page),
    staleTime: 1000 * 60 * 10, // cache valid for 10 mins
  });

  // handles search button click
  // reset to page 1 on new serach
  const handleSearch = () => {
    setQuery(searchTerm.trim());
    setPage(1);
  };

  // handles enter key press
  // reset to page 1 on new serach
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
      setPage(1);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Discover</h1>

      <div className='flex gap-0 w-full justify-center'>
        <Input
          type="text"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="py-2 mb-6 max-w-3/4 rounded-r-none focus-visible:ring-0"
        />
        <Button className='rounded-l-none border-l-0' variant="outline" onClick={handleSearch}>Search</Button>
      </div>

      {isLoading &&
        <div className="p-4 flex items-center justify-center">
          <svg className="w-8 animate-spin fill-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>loading</title><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" /></svg>
        </div>}
      {error && <p className="text-red-500">Failed to load manxas.</p>}

      {data?.data.results && data.data.results.length > 0 ? (
        <div className='flex flex-wrap gap-8 max-w-6xl items-center justify-center'>
          {data?.data.results.map((manxa: Manxa) => (
            <ManxaCard key={manxa.title} manxa={manxa}></ManxaCard>
          ))}
        </div>
      ) : !isLoading ? (
        <p className="text-gray-500">No manxas found</p>
      ) : null}

    </div>
  );
}

export default Discover;
