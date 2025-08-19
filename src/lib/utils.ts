import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Extracts the slug from a full URL by removing the given base path.
export function extractSlug(url: string, base: string): string {
  const normalizedBase = base.endsWith("/") ? base : base + "/";
  if (!url.startsWith(normalizedBase)) {
    throw new Error("URL does not start with the given base path.");
  }
  return url.slice(normalizedBase.length);
}

//Builds a full URL from a base path and a slug.
export function buildUrl(base: string, slug: string): string {
  const normalizedBase = base.endsWith("/") ? base : base + "/";
  const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;
  return normalizedBase + normalizedSlug;
}

//unslugs a slug
export function unslug(slug: string): string {
  return slug.replace(/-/g, " ");
}

// capitalize the first letter of a string
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
