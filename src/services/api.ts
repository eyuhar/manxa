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
  FetchHistoryResponse,
  Manxa,
  ManxaDetailed,
  Chapter,
} from "@/types";
import { getCountryCode } from "@/lib/utils";

// fetches a list of manxa from the new MangaDex API
export async function fetchManxaListDex(page = 1): Promise<ManxaListResponse> {
  try {
    const apiUrl = `https://api.mangadex.org/manga?limit=24&offset=${
      (page - 1) * 20
    }&includes[]=cover_art&availableTranslatedLanguage[]=en&order[rating]=desc&hasAvailableChapters=true`;

    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/proxy-dex?url=" +
        encodeURIComponent(apiUrl)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch manga list from new API");
    }

    const json = await res.json();

    const success = json.result === "ok";

    const results: Manxa[] = (
      Array.isArray(json.data) ? json.data : [json.data]
    ).map((item: any): Manxa => {
      const titleObj = item.attributes.title || {};
      const title =
        titleObj.en || Object.values(titleObj)[0] || "Unknown title";

      const descObj = item.attributes.description || {};
      const summary = descObj.en || Object.values(descObj)[0] || "";

      //find cover art relationship
      const coverRel = item.relationships?.find(
        (r: any) => r.type === "cover_art"
      );
      const fileName = coverRel?.attributes?.fileName;

      const img = fileName
        ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.256.jpg`
        : "";

      return {
        title,
        url: `https://api.mangadex.org/manga/${item.id}`,
        img,
        newestChapter: item.attributes.lastChapter || "",
        summary,
      };
    });

    // Return in the old format
    const response: ManxaListResponse = {
      success,
      data: {
        totalResults: 0,
        totalPages: 0,
        results,
      },
    };

    return response;
  } catch (error) {
    console.error("fetchManxaList Error", error);
    throw error;
  }
}

//fetches a list of manxas from the API
export async function fetchManxaList(page = 1): Promise<ManxaListResponse> {
  try {
    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/manxas?page=" +
        encodeURIComponent(page)
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

// Fetches detailed information about a specific manga from the MangaDex API
export async function fetchManxaDex(
  url: string
): Promise<ManxaDetailedResponse> {
  try {
    const id = url.split("/").pop(); // Extract manga ID from URL
    if (!id) throw new Error("Invalid Manga URL provided");
    const apiUrl = `https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author`;

    // Fetch main manga data including cover_art
    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/proxy-dex?url=" +
        encodeURIComponent(apiUrl)
    );
    if (!res.ok) throw new Error("Failed to fetch manga data");
    const data = await res.json();

    const manga = data.data;
    const attrs = manga.attributes;

    // Build image URL using cover_art relationship
    const coverRel = manga.relationships.find(
      (rel: any) => rel.type === "cover_art"
    );
    const coverFileName = coverRel?.attributes?.fileName;
    const img = coverFileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
      : "";

    // Fetch rating + follows from statistics endpoint
    const statsRes = await fetch(
      "https://manxa-backend.abrdns.com/api/proxy-dex?url=" +
        encodeURIComponent(`https://api.mangadex.org/statistics/manga/${id}`)
    );
    if (!statsRes.ok) throw new Error("Failed to fetch manga statistics");
    const statsData = await statsRes.json();
    const stats = statsData.statistics[id];
    const rating = stats?.rating?.bayesian?.toFixed(2) || "N/A";
    const views = stats?.follows || 0;

    // Fetch all chapters for this manga
    const chaptersRes = await fetch(
      "https://manxa-backend.abrdns.com/api/proxy-dex?url=" +
        encodeURIComponent(
          `https://api.mangadex.org/manga/${id}/feed?limit=500&translatedLanguage[]=en&order[chapter]=desc`
        )
    );
    if (!chaptersRes.ok) throw new Error("Failed to fetch chapters");
    const chaptersData = await chaptersRes.json();

    // Helper function to format dates
    const formatDate = (isoDate: string) =>
      new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    // Build chapters array with URLs
    const chapters: Chapter[] = chaptersData.data.map((ch: any) => ({
      chapter: ch.attributes.chapter || "N/A",
      chapterUrl: `https://api.mangadex.org/at-home/server/${ch.id}`,
      chapterViews: 0,
      chapterUploadTime: formatDate(ch.attributes.publishAt),
      language: getCountryCode(ch.attributes.translatedLanguage),
    }));

    // Extract genres (all tags with English names)
    const genres = (attrs.tags || [])
      .map((t: any) => t.attributes?.name?.en)
      .filter(Boolean);

    // Extract authors
    const authors = manga.relationships
      .filter((rel: any) => rel.type === "author")
      .map((rel: any) => rel.attributes?.name)
      .filter(Boolean)
      .join(", ");

    // Build final ManxaDetailed object
    const manxaDetailed: ManxaDetailed = {
      img,
      title: attrs.title?.en || "Unknown Title",
      authors,
      status: attrs.status || "unknown",
      lastUpdate: formatDate(attrs.updatedAt),
      views,
      genres,
      rating,
      summary: attrs.description?.en || "No description available.",
      chapters,
    };

    // Return wrapped response
    return {
      success: true,
      data: manxaDetailed,
    };
  } catch (error) {
    console.error("fetchManxa Error", error);
    return {
      success: false,
      data: {} as ManxaDetailed, // fallback to empty data object
    };
  }
}

//fetches detailed information about a specific manxa from the API
export async function fetchManxa(url: string): Promise<ManxaDetailedResponse> {
  try {
    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/manxa?manxa_url=" +
        encodeURIComponent(url)
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

// fetches a list of manxa from the new MangaDex API
export async function searchManxasDex(
  term: string,
  page = 1
): Promise<ManxaListResponse> {
  try {
    const apiUrl = `https://api.mangadex.org/manga?title=${term}&limit=24&offset=${
      (page - 1) * 20
    }&includes[]=cover_art&availableTranslatedLanguage[]=en&order[rating]=desc`;

    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/proxy-dex?url=" +
        encodeURIComponent(apiUrl)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch manga list from new API");
    }

    const json = await res.json();

    const success = json.result === "ok";

    const results: Manxa[] = (
      Array.isArray(json.data) ? json.data : [json.data]
    ).map((item: any): Manxa => {
      const titleObj = item.attributes.title || {};
      const title =
        titleObj.en || Object.values(titleObj)[0] || "Unknown title";

      const descObj = item.attributes.description || {};
      const summary = descObj.en || Object.values(descObj)[0] || "";

      //find cover art relationship
      const coverRel = item.relationships?.find(
        (r: any) => r.type === "cover_art"
      );
      const fileName = coverRel?.attributes?.fileName;

      const img = fileName
        ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.256.jpg`
        : "";

      return {
        title,
        url: `https://api.mangadex.org/manga/${item.id}`,
        img,
        newestChapter: item.attributes.lastChapter || "",
        summary,
      };
    });

    // Return in the old format
    const response: ManxaListResponse = {
      success,
      data: {
        totalResults: 0,
        totalPages: 0,
        results,
      },
    };

    return response;
  } catch (error) {
    console.error("fetchManxaList Error", error);
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
      "https://manxa-backend.abrdns.com/api/manxas?query=" +
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

// fetches a list of image URLs for a specific chapter
export async function fetchChapterImageUrlsDex(
  chapterUrl: string,
  quality: "data" | "dataSaver" = "data" // default: full quality
): Promise<ChapterImageUrlsResponse> {
  try {
    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/proxy-dex?url=" +
        encodeURIComponent(chapterUrl)
    );

    if (!res.ok) {
      throw new Error("Failed to fetch chapter image URLs");
    }

    const json = await res.json();

    const baseUrl = json.baseUrl;
    const hash = json.chapter.hash;
    const images = json.chapter[quality] || [];

    const imageUrls: string[] = images.map(
      (filename: string) => `${baseUrl}/data/${hash}/${filename}`
    );

    return {
      success: true,
      data: imageUrls,
    };
  } catch (error) {
    console.error("fetchChapterImageUrls Error", error);
    return {
      success: false,
      data: [],
    };
  }
}

//fetches a list of image URLs for a specific chapter
export async function fetchChapterImageUrls(
  chapterUrl: string
): Promise<ChapterImageUrlsResponse> {
  try {
    const res = await fetch(
      "https://manxa-backend.abrdns.com/api/chapter?chapter=" +
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
    const response = await fetch("https://manxa-backend.abrdns.com/api/lists", {
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
    const response = await fetch("https://manxa-backend.abrdns.com/api/lists", {
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
    const response = await fetch("https://manxa-backend.abrdns.com/api/lists", {
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
    const response = await fetch("https://manxa-backend.abrdns.com/api/lists", {
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
    const response = await fetch(
      "https://manxa-backend.abrdns.com/api/favorites",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favorites),
      }
    );

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
      "https://manxa-backend.abrdns.com/api/favorites?list=" +
        encodeURIComponent(list),
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
    const response = await fetch(
      "https://manxa-backend.abrdns.com/api/favorites",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favorites),
      }
    );

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
      "https://manxa-backend.abrdns.com/api/chapter-progress?manxa_url=" +
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
  toMark: { manxa_url: string; chapter_url: string; chapter: string }[]
): Promise<ManageChapterProgressResponse> {
  try {
    const response = await fetch(
      "https://manxa-backend.abrdns.com/api/chapter-progress",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toMark),
      }
    );

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
    const response = await fetch(
      "https://manxa-backend.abrdns.com/api/chapter-progress",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toUnmark),
      }
    );

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

// fetch reading history
export async function fetchHistory(
  token: string
): Promise<FetchHistoryResponse> {
  try {
    const response = await fetch(
      "https://manxa-backend.abrdns.com/api/history",
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
    console.error("fetchHistory Error", error);
    throw error;
  }
}
