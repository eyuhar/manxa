import type {
  ManxaListResponse,
  ManxaDetailedResponse,
  ChapterImageUrlsResponse,
  ManageListResponse,
  FetchListsResponse,
  AddFavoriteResponse,
  FetchFavoritesResponse,
  RemoveFavoriteResponse,
  FetchChapterProgressResponse,
  ManageChapterProgressResponse,
} from "@/types";

//fetches a list of manxas from the API
export async function fetchManxaList(page = 1): Promise<ManxaListResponse> {
  try {
    const res = await fetch(
      "http://52.59.130.106/api/manxas?page=" + encodeURIComponent(page)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch manxa list");
    }

    return res.json();
  } catch (error) {
    console.error("fetchManxaList Error", error);
    throw error;
  }
}

//fetches detailed information about a specific manxa from the API
export async function fetchManxa(url: string): Promise<ManxaDetailedResponse> {
  try {
    const res = await fetch(
      "http://52.59.130.106/api/manxa?manxa_url=" + encodeURIComponent(url)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch manxa data");
    }

    return res.json();
  } catch (error) {
    console.error("fetchManxa Error", error);
    throw error;
  }
}

//fetches a list of manxas that match the search term
export async function searchManxas(
  term: string,
  page = 1
): Promise<ManxaListResponse> {
  try {
    const res = await fetch(
      "http://52.59.130.106/api/manxas?query=" +
        encodeURIComponent(term) +
        "&page=" +
        encodeURIComponent(page)
    );

    if (!res.ok) {
      throw new Error("Failed to search manxas");
    }

    return res.json();
  } catch (error) {
    console.error("searchManxas Error", error);
    throw error;
  }
}

//fetches a list of image URLs for a specific chapter
export async function fetchChapterImageUrls(
  chapterUrl: string
): Promise<ChapterImageUrlsResponse> {
  try {
    const res = await fetch(
      "http://52.59.130.106/api/chapter?chapter=" +
        encodeURIComponent(chapterUrl)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch chapter image URLs");
    }

    return res.json();
  } catch (error) {
    console.error("fetchChapterImageUrls Error", error);
    throw error;
  }
}

// create a custom favorites list
export async function addList(
  token: string,
  name: string
): Promise<ManageListResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/lists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("addList Error:", error);
    throw error;
  }
}

// remove a custom favorites list
export async function removeList(
  token: string,
  name: string
): Promise<ManageListResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/lists", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("removeList Error:", error);
    throw error;
  }
}

// rename a custom favorites list
export async function renameList(
  token: string,
  payload: { old_name: string; new_name: string }
): Promise<ManageListResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/lists", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("renameList Error:", error);
    throw error;
  }
}

// get all user-defined lists
export async function fetchLists(token: string): Promise<FetchListsResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/lists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user lists.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getLists Error", error);
    throw error;
  }
}

// add a manxa to one or multiple lists
export async function addFavorite(
  token: string,
  favorites: { title: string; manxa_url: string; list_name: string }[]
): Promise<AddFavoriteResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/favorites", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favorites),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("addFavorite Error", error);
    throw error;
  }
}

// fetch all favorite manxas from a list
export async function fetchFavorites(
  token: string,
  list: string
): Promise<FetchFavoritesResponse> {
  try {
    const response = await fetch(
      "http://52.59.130.106/api/favorites?list=" + encodeURIComponent(list),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchFavorites Error", error);
    throw error;
  }
}

// Removes a manxa from one or multiple lists
export async function removeFavorite(
  token: string,
  favorites: { manxa_url: string; list_name: string }[]
): Promise<RemoveFavoriteResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/favorites", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favorites),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("removeFavorite Error", error);
    throw error;
  }
}

// fetch list of chapter urls marked as read for a specific manxa
export async function fetchChapterProgress(
  token: string,
  manxa_url: string
): Promise<FetchChapterProgressResponse> {
  try {
    const response = await fetch(
      "http://52.59.130.106/api/chapter-progress?manxa_url=" +
        encodeURIComponent(manxa_url),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchChapterProgress Error", error);
    throw error;
  }
}

// Marks one or more chapters as read for a user by sending their progress to the API.
export async function markChapterAsRead(
  token: string,
  toMark: { manxa_url: string; chapter_url: string }[]
): Promise<ManageChapterProgressResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/chapter-progress", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toMark),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("markChapterAsRead Error", error);
    throw error;
  }
}

// Marks one or more chapters as unread for a user by sending their progress to the API.
export async function markChapterAsUnread(
  token: string,
  toUnmark: { manxa_url: string; chapter_url: string }[]
): Promise<ManageChapterProgressResponse> {
  try {
    const response = await fetch("http://52.59.130.106/api/chapter-progress", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toUnmark),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("markChapterAsUnread Error", error);
    throw error;
  }
}
