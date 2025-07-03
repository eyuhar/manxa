import { fetchManxa, fetchManxaList } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { buildUrl, extractSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ManxaDetailed } from "@/types";
import ManxaCard from "@/components/ManxaCard";
import StarRating from "@/components/StarRating";



export default function ManxaDetail() {
    const { title } = useParams<{ title: string }>();

    const {
        data: ManxaDetail,
        isLoading: isLoadingManxaDetail,
        isError: isErrorManxaDetail,
    } = useQuery({
        queryKey: ["manxaDetail", title],
        queryFn: () => title ? fetchManxa(buildUrl("https://www.mangakakalot.gg/manga/", title)) : Promise.reject("No title provided"),
        enabled: !!title,
        retry: false,
    });

    const {
        data: featuredManxas,
        isLoading: isLoadingFeaturedManxas,
    } = useQuery({
        queryKey: ['featuredManxas'],
        queryFn: () => fetchManxaList(1),
    });

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

    if (isErrorManxaDetail) {
        return (
            <div className="p-4 text-center">
                <p className="mb-3 text-accent-foreground font-semibold">Manxa not found</p>
                <p className="mb-4 text-sm text-muted-foreground">Try searching again via the Discover page</p>
                <Button variant="outline" asChild>
                    <Link to="/discover">
                        Back to Discover
                    </Link>
                </Button>
            </div>
        );
    }

    if (!ManxaDetail?.data) {
        return <div className="p-4 text-muted-foreground">No manxa data found.</div>;
    }

    const manxa: ManxaDetailed = ManxaDetail.data;

    return (
        <div className="max-w-6xl p-4 flex flex-col">
            <div className="[@media(max-width:655px)]:flex-col flex items-center rounded-xl border-gray-200 self-center w-full">
                <div className="h-80 overflow-hidden flex shrink-0 justify-center items-center">
                    <img className="rounded-md h-full object-cover" src={"http://52.59.130.106/api/imageProxy.php?url=" + encodeURIComponent(manxa.img)} alt={manxa.title} />
                </div>
                <Card className="border-0 shadow-none min-w-80 w-full">
                    <CardHeader className="flex flex-col">
                        <CardTitle className="[@media(max-width:655px)]:self-center">{manxa.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">Author(s)</CardTitle>
                            <CardDescription className="[@media(max-width:655px)]:self-center">{manxa.authors}</CardDescription>
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">Status</CardTitle>
                            <CardDescription className="[@media(max-width:655px)]:self-center">{manxa.status}</CardDescription>
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">Last Update</CardTitle>
                            <CardDescription className="[@media(max-width:655px)]:self-center">{manxa.lastUpdate}</CardDescription>
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">Views</CardTitle>
                            <CardDescription className="[@media(max-width:655px)]:self-center">{manxa.views.toLocaleString("en-US")}</CardDescription>
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">Genres</CardTitle>
                            <CardDescription className="[@media(max-width:655px)]:self-center">{manxa.genres.join(", ")}</CardDescription>
                        </div>
                        <div className="flex [@media(max-width:655px)]:flex-col justify-between">
                            <div className="flex flex-col">
                                <CardTitle className="font-medium text-sm [@media(max-width:655px)]:self-center">Rating</CardTitle>
                                <CardDescription className="[@media(max-width:655px)]:self-center">
                                    <div className="flex items-center gap-2">
                                        <div>{manxa.rating}</div>
                                        <StarRating rating={parseFloat(manxa.rating.split("/")[0])} />
                                    </div>    
                                </CardDescription>
                            </div>
                            <div className="[@media(min-width:655px)]:hidden flex flex-col">
                                <CardTitle className="font-medium text-sm self-center">Summary</CardTitle>
                                <CardDescription className="wrap-anywhere">{manxa.summary}</CardDescription>
                            </div>
                            <Button variant="outline" className="self-end ml-5 [@media(max-width:655px)]:w-full [@media(max-width:655px)]:self-center [@media(max-width:655px)]:mt-3">
                                <svg
                                    className="w-5 fill-foreground"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <title>bookmark-outline</title>
                                    <path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
                                </svg>
                                <p>Add</p>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="[@media(max-width:655px)]:hidden flex flex-col p-2">
                <CardTitle className="font-medium text-sm mb-2 self-center">Summary</CardTitle>
                <CardDescription className="wrap-anywhere">{manxa.summary}</CardDescription>
            </div>
            <div className="flex [@media(max-width:550px)]:flex-col justify-center items-center gap-2 w-full">
                <Card className="mt-8 max-w-3xl self-start w-full">
                    <CardHeader className="flex flex-col">
                        <CardTitle className="self-center">
                            Chapters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1 max-h-[902px] [@media(max-width:900px)]:max-h-[758px] overflow-y-auto scrollbar">
                        {manxa.chapters.map((chapter, index) => (
                            <Link to={`/manxa/${extractSlug(chapter.chapterUrl, "https://www.mangakakalot.gg/manga/")}`} key={index} className="flex w-full items-center justify-between hover:bg-accent hover:text-accent-foreground p-2 rounded-md">
                                <CardTitle className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap flex-1">{chapter.chapter}</CardTitle>
                                <CardDescription>{chapter.chapterUploadTime}</CardDescription>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
                <Card className="mt-8 max-w-[220px] [@media(max-width:550px)]:max-w-full w-full border-0 shadow-none">
                    <CardHeader className="flex flex-col">
                        <CardTitle className="self-center mb-6">
                            Trending
                        </CardTitle>
                        <CardContent className="flex [@media(min-width:550px)]:flex-col self-center">
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
                                </div>) : (
                                    featuredManxas?.data?.results?.length && featuredManxas?.data?.results?.length > 0 ? (
                                        <div className="flex [@media(min-width:550px)]:flex-col justify-center flex-wrap gap-4">
                                        {featuredManxas?.data.results.slice(0, 3).map((manxa, index) => (
                                            <Link to={`/manxa/${extractSlug(manxa.url, "https://www.mangakakalot.gg/manga/")}`} key={index}>
                                                <ManxaCard manxa={manxa}/>
                                            </Link>
                                        ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-muted-foreground">No trending manxas found.</div>
                                    )
                                )}
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
