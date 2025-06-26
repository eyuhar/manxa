import type { ManxaListResponse, ManxaDetailedResponse } from "@/types";

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