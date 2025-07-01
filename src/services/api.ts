import type { ManxaListResponse, ManxaDetailedResponse, ChapterImageUrlsReponse } from "@/types";

//fetches a list of manxas from the API
export async function fetchManxaList(page = 1): Promise<ManxaListResponse> {
  const res = await fetch("http://52.59.130.106/api/manxaList.php?page=" + encodeURIComponent(page));
  
  if (!res.ok) {
    throw new Error("Failed to fetch featured manxas");
  }
  
  return res.json();
}

//fetches detailed information about a specific manxa from the API
export async function fetchManxa(url: string): Promise<ManxaDetailedResponse> {
  const res = await fetch("http://52.59.130.106/api/manxa.php?manxa_url=" + encodeURIComponent(url));
  
  if (!res.ok) {
    throw new Error("Failed to fetch manxa data");
  }
  
  return res.json();
}

//fetches a list of manxas that match the search term
export async function searchManxas(term: string, page = 1): Promise<ManxaListResponse> {
  const res = await fetch("http://52.59.130.106/api/search.php?query=" + encodeURIComponent(term) + "&page=" + encodeURIComponent(page));
  
  if (!res.ok) {
    throw new Error("Failed to search manxas");
  }
  
  return res.json();
}

//fetches a list of image URLs for a specific chapter
export async function fetchChapterImageUrls(chapterUrl: string): Promise<ChapterImageUrlsReponse> {
  const res = await fetch("http://52.59.130.106/api/chapter.php?chapter=" + encodeURIComponent(chapterUrl));

  if (!res.ok) {
    throw new Error("Failed to fetch chapter image URLs");
  }

  return res.json();
}

// Function to fetch image from the API and cache it as a Blob
export async function fetchImageAsBlobUrl(imageUrl: string): Promise<string> {
  const res = await fetch("http://52.59.130.106/api/imageProxy.php?url=" + encodeURIComponent(imageUrl));

  if (!res.ok) {
    throw new Error("Failed to fetch image");
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}