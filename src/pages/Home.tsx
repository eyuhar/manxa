import type { JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import ManxaCarousel from "../components/ManxaCarousel";
import { fetchManxaList } from "../services/api";
import type { Manxa } from "@/types";
import ManxaCard from "@/components/ManxaCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { extractSlug } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function Home(): JSX.Element {
  // fetch list of manxa data
  const { data, isLoading } = useQuery({
    queryKey: ["featuredManxas"],
    queryFn: () => fetchManxaList(1),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  //show loading icon if data is still loading
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

  if (!data || !data.data || !data.data.results) {
    return <div className="p-4">No featured manxas found.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="w-full text-center font-semibold text-xl">
        Featured Manxa
      </h1>
      <hr className="w-full mt-2 mb-2 border-border" />
      <ManxaCarousel
        manxas={data.data.results
          .slice(0, 3)
          .reverse()
          .concat(data.data.results.slice(3, 4))}
      ></ManxaCarousel>
      <hr className="w-full mt-2 mb-2 border-border" />
      <h1 className="w-full text-center font-semibold text-xl mt-10 mb-10">
        Announcements
      </h1>
      <div className="w-full max-w-4xl grid grid-cols-2 gap-5 p-2">
        <Card className="items-center px-4">
          <CardTitle>🌙 Dark Mode Available</CardTitle>
          <CardDescription>
            Dark mode is here! Toggle themes anytime with the button in the
            top-right corner.
          </CardDescription>
        </Card>
        <Card className="items-center px-4">
          <CardTitle>🚀 Improved Discover Page</CardTitle>
          <CardDescription>
            We've added infinite scrolling to the Discover page. Browse more
            titles without constantly clicking "next" - just scroll down and new
            manxa will load automatically.
          </CardDescription>
        </Card>
      </div>
      <h1 className="w-full text-center font-semibold text-xl mt-10 mb-10">
        Top Manxa
      </h1>
      <div className="flex flex-wrap gap-8 max-w-6xl items-center justify-center">
        {data.data.results.slice(4).map((manxa: Manxa, i: number) => (
          <Link
            to={`/manxa/${extractSlug(
              manxa.url,
              "https://www.mangakakalot.gg/manga/"
            )}`}
            key={i}
          >
            <ManxaCard manxa={manxa} />
          </Link>
        ))}
      </div>
      <Button className="mt-10 mb-10" variant="outline" asChild>
        <Link to="discover">Discover more..</Link>
      </Button>
    </div>
  );
}
