import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, type JSX } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as authLogin,
  getToken,
  type LoginResponse,
} from "@/services/auth";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import {
  addFavorite,
  addList,
  fetchFavorites,
  fetchLists,
  removeFavorite,
} from "@/services/api";
import { Checkbox } from "./ui/checkbox";
import type { AddFavoriteResponse, ManageListResponse } from "@/types";
import { toast } from "sonner";
import { buildUrl } from "@/lib/utils";

export default function DialogAdd({
  className,
  title,
}: {
  className?: string;
  title: string;
}): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [newList, setNewList] = useState<string>("");
  const [initialLists, setInitialLists] = useState<string[]>([]);

  const { user, login } = useAuth();
  const queryClient = useQueryClient();

  // useMutation handles the login call
  const loginMutation = useMutation({
    mutationFn: (): Promise<LoginResponse> => authLogin(email, password),
    onSuccess: (data: LoginResponse) => {
      // save token and redirect on success
      login(data.token);
      toast.success("Login successful.");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials.");
    },
  });

  // login form submit handler
  const handleLoginSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    loginMutation.mutate(); // triggers login
  };

  const handleCheckedChange = (checked: boolean, value: string) => {
    setSelectedLists(
      (prev) =>
        checked
          ? [...prev, value] // select
          : prev.filter((item) => item !== value) // deselect
    );
  };

  // get the users custom lists
  const token = getToken();
  const { data: userLists, isLoading: isLoadingUserLists } = useQuery({
    queryKey: ["userLists"],
    queryFn: () => fetchLists(token!),
    enabled: !!token,
  });

  // look up if manxa is already in some favorite list/s
  // set states(selectedLists, initialLists) accordingly
  useEffect(() => {
    if (!token || !userLists?.lists) return;

    const fetchInitialFavorites = async () => {
      const listsContainingManxa: string[] = [];

      await Promise.all(
        userLists.lists.map(async (list: { name: string }) => {
          const res = await fetchFavorites(token, list.name);
          // ruft /api/favorites/get.php?list_name=list.name
          const isInList = res.favorites.some((fav) => fav.title === title);
          if (isInList) {
            listsContainingManxa.push(list.name);
          }
        })
      );

      setSelectedLists(listsContainingManxa);
      setInitialLists(listsContainingManxa);
    };

    fetchInitialFavorites();
  }, [userLists, title]);

  // addListMutation handles adding of a new List
  const addListMutation = useMutation({
    mutationFn: (): Promise<ManageListResponse> => addList(token!, newList),
    onSuccess: (data: ManageListResponse) => {
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

  // handles enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const closeButton = document.querySelector(
        "#addList"
      ) as HTMLButtonElement | null;
      closeButton?.click();
    }
  };

  // addFavoriteMutation handles adding a manxa to list(s)
  const addFavoriteMutation = useMutation({
    mutationFn: (
      entries: { title: string; manxa_url: string; list_name: string }[]
    ): Promise<AddFavoriteResponse> => addFavorite(token!, entries),
    onSuccess: (_data, variables) => {
      //On success, invalidate the relevant "favorites" queries for each affected list
      variables.forEach((fav) => {
        queryClient.invalidateQueries({
          queryKey: ["favorites", fav.list_name],
        });
      });
      toast.success("Manxa successfully added.");
    },
    onError: () => {
      toast.error("Failed to add manxa.");
    },
  });

  // removeFavoriteMutation handles removing a manxa from a list
  const removeFavoriteMutation = useMutation({
    mutationFn: (favorites: { manxa_url: string; list_name: string }[]) =>
      removeFavorite(token!, favorites),
    onSuccess: (_data, variables) => {
      //On success, invalidate the relevant "favorites" queries for each affected list
      variables.forEach((fav) => {
        queryClient.invalidateQueries({
          queryKey: ["favorites", fav.list_name],
        });
      });

      toast.success("Manxa successfully removed.");
    },
    onError: () => {
      toast.error("Failed to remove manxa.");
    },
  });

  const handleSaveChanges = () => {
    const toAdd = selectedLists.filter((l) => !initialLists.includes(l));
    const toRemove = initialLists.filter((l) => !selectedLists.includes(l));

    if (toAdd.length === 0 && toRemove.length === 0) {
      toast.info("No changes.");
      return;
    }

    // Add manxa to list/s
    if (toAdd.length > 0) {
      const payload = toAdd.map((list_name) => ({
        title,
        manxa_url: buildUrl("https://www.mangakakalot.gg/manga/", title),
        list_name,
      }));
      addFavoriteMutation.mutate(payload);
    }

    // Remove manxa from list/s
    if (toRemove.length > 0) {
      const payload = toRemove.map((list_name) => ({
        manxa_url: buildUrl("https://www.mangakakalot.gg/manga/", title),
        list_name,
      }));
      removeFavoriteMutation.mutate(payload);
    }

    setInitialLists(selectedLists);
  };

  return user ? (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button variant="outline" className="flex gap-1 cursor-pointer">
          <svg
            className="w-5 fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>bookmark-outline</title>
            <path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
          </svg>
          <p>Bookmark</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>Manage Lists</DialogTitle>
          <DialogDescription>
            Manage the lists this manxa belongs to, or create a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
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
            userLists?.lists.map((list, i) => (
              <div key={i} className="flex items-center gap-3">
                <Checkbox
                  id={list.name}
                  value={list.name}
                  checked={selectedLists.includes(list.name)}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(Boolean(checked), list.name)
                  }
                />
                <Label htmlFor={list.name}>{list.name}</Label>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2 mt-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mr-auto">
                New List
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[364px]">
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
          <DialogClose asChild>
            <Button variant="outline" size="sm" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <Button variant="outline" className="flex gap-1 cursor-pointer">
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
      </DialogTrigger>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Please log in to bookmark this manxa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLoginSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
