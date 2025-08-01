import ManxaCard from "@/components/ManxaCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractSlug } from "@/lib/utils";
import {
  addList,
  fetchFavorites,
  fetchLists,
  fetchManxa,
} from "@/services/api";
import { getToken } from "@/services/auth";
import type { AddListResponse } from "@/types";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function MyManxa(): JSX.Element {
  const [selectedList, setSelectedList] = useState<string>("");
  const [newList, setNewList] = useState<string>("");
  const queryClient = useQueryClient();
  const token = getToken();

  // get the users custom lists
  const {
    data: userLists,
    isLoading: isLoadingUserLists,
    isSuccess: isSuccessUserLists,
  } = useQuery({
    queryKey: ["userLists"],
    queryFn: () => fetchLists(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // set the first list as selected if available
  useEffect(() => {
    if (isSuccessUserLists && userLists?.lists.length > 0) {
      setSelectedList(userLists.lists[0].name);
    }
  }, [isSuccessUserLists]);

  // fetch favorites for the selected list
  const { data: favoritesData, isLoading: isLoadingFavoritesData } = useQuery({
    queryKey: ["favorites", selectedList],
    queryFn: () => fetchFavorites(token!, selectedList),
    enabled: !!token && selectedList !== "",
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // this will be used to display the favorites in the selected list
  const favorites = favoritesData?.favorites || [];
  const manxaQueries = useQueries({
    queries: favorites.map((fav) => ({
      queryKey: ["favorite", fav.manxa_url],
      queryFn: () => fetchManxa(fav.manxa_url),
      enabled: !!fav.manxa_url,
      staleTime: 1000 * 60 * 60, // 1 hour
    })),
  });
  // loading status for useQueries ^
  const isLoadingFavorites = manxaQueries.some((query) => query.isLoading);
  // use only successfully loaded data
  const favoriteData = manxaQueries.map((q) => q.data).filter((data) => !!data);

  // addListMutation handles adding of a new List
  const addListMutation = useMutation({
    mutationFn: (): Promise<AddListResponse> => addList(token!, newList),
    onSuccess: (data: AddListResponse) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["userLists"] });
      setNewList("");
    },
    onError: () => {
      toast.error("Failed to add List.");
    },
  });

  const handleAddList = () => {
    if (!newList.trim()) {
      toast.error("List name cannot be empty.");
      return;
    }
    addListMutation.mutate();
  };

  // handles enter key press for add list input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const closeButton = document.querySelector(
        "#addList"
      ) as HTMLButtonElement | null;
      closeButton?.click();
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-1">
      {isLoadingUserLists ? (
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
        <Tabs
          value={selectedList}
          onValueChange={setSelectedList}
          className="max-w-6xl w-full items-center"
        >
          <div className="w-full flex gap-2 mb-2 items-center justify-center">
            <div className="overflow-hidden">
              <ScrollArea className="pb-2" scrollHideDelay={0}>
                <TabsList className="inset-shadow-[0_2px_2px_var(--ring)] flex ">
                  {userLists?.lists.map((list) => {
                    return (
                      <TabsTrigger
                        key={list.name}
                        value={list.name}
                        className="relative data-[state=active]:bg-muted data-[state=active]:shadow-none"
                      >
                        {selectedList === list.name && (
                          <motion.div
                            layoutId="tabHighlight"
                            className="absolute inset-0 bg-background rounded-md shadow-sm"
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 40,
                            }}
                          />
                        )}
                        <span className="relative z-1">{list.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div className="mb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    New List
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-sm">
                  <DialogTitle>New List</DialogTitle>
                  <DialogDescription>
                    Choose a name and create a new List.
                  </DialogDescription>
                  <div className="flex gap-2">
                    <Input
                      className=""
                      id="newList"
                      type="text"
                      placeholder="My New List"
                      value={newList}
                      onChange={(e) => setNewList(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                    <DialogClose asChild>
                      <Button
                        id="addList"
                        variant={"outline"}
                        onClick={handleAddList}
                      >
                        Add
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {userLists?.lists.map((list) => {
            return (
              <TabsContent key={list.name} value={list.name} className="w-full">
                <div className="flex flex-wrap gap-8 justify-center">
                  {isLoadingFavoritesData || isLoadingFavorites ? (
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
                    favoriteData.map((manxa, i) => (
                      <Link
                        to={`/manxa/${extractSlug(
                          favorites[i].manxa_url,
                          "https://www.mangakakalot.gg/manga/"
                        )}`}
                        key={manxa.data.title}
                        className="animate-fade-up"
                        style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                      >
                        <ManxaCard
                          manxa={{
                            title: manxa.data.title,
                            url: favorites[i].manxa_url,
                            img: manxa.data.img,
                          }}
                        />
                      </Link>
                    ))
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

export default MyManxa;
