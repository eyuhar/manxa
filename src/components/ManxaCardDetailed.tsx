import { fetchManxa } from "@/services/api";
import type { ManxaDetailed } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useNavigate } from "react-router-dom";
import { extractSlug } from "@/lib/utils";
import StarRating from "./StarRating";

type Props = {
  url: string;
};

// card UI to display manxa cover and detailed manxa info, for use in ManxaCarousel
export default function ManxaCardDetailed({ url }: Props): JSX.Element {
  //fetch data of required manxa
  const { data, isLoading } = useQuery({
    queryKey: ["manxaDetail", url],
    queryFn: () => fetchManxa(url),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
  const navigate = useNavigate();

  //show loading icon if data is still loading
  if (isLoading) {
    return (
      <div className="p-4 flex h-100 items-center justify-center">
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

  //show message if fetched data is empty
  if (!data) {
    return <div className="p-4 text-muted-foreground">Manxa not found.</div>;
  }

  const manxaData: ManxaDetailed = data.data;

  const handleClick = () => {
    navigate(
      `/manxa/${extractSlug(url, "https://www.mangakakalot.gg/manga/")}`
    );
  };

  return (
    <>
      <div className="[@media(max-width:655px)]:hidden flex h-100 max-w-dvw items-center rounded-xl border-gray-200">
        <img
          className="rounded-xl h-80 cursor-pointer"
          src={
            "https://52.59.130.106/api/image-proxy?url=" +
            encodeURIComponent(manxaData.img)
          }
          alt={manxaData.title}
          onClick={handleClick}
        />
        <Card className="border-0 h-100 shadow-none overflow-scroll overflow-x-hidden scrollbar bg-background">
          <CardHeader>
            <CardTitle
              className="cursor-pointer hover:underline"
              onClick={handleClick}
            >
              {manxaData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Author(s)</CardTitle>
              <CardDescription>{manxaData.authors}</CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Status</CardTitle>
              <CardDescription>{manxaData.status}</CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Last Update</CardTitle>
              <CardDescription>{manxaData.lastUpdate}</CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Views</CardTitle>
              <CardDescription>
                {manxaData.views.toLocaleString("en-US")}
              </CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Genres</CardTitle>
              <CardDescription>{manxaData.genres.join(", ")}</CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Rating</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <div>{manxaData.rating}</div>
                  <StarRating
                    rating={parseFloat(manxaData.rating.split("/")[0])}
                  />
                </div>
              </CardDescription>
            </div>
            <div className="flex flex-col">
              <CardTitle className="font-medium text-sm">Summary</CardTitle>
              <CardDescription>{manxaData.summary}</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="[@media(min-width:655px)]:hidden w-full flex flex-col justify-center h-100 items-center">
        <img
          className="rounded-xl h-80"
          src={
            "https://52.59.130.106/api/image-proxy?url=" +
            encodeURIComponent(manxaData.img)
          }
          alt={manxaData.title}
        />
        <Card className="border-0 shadow-none w-full">
          <CardHeader className="w-full">
            <CardTitle className="flex items-center justify-center hover:underline">
              {manxaData.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
