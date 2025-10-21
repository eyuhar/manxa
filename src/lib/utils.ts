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

// Extracts the country code from a language code.
export function getCountryCode(languageCode: string): string {
  // Split the code by hyphen
  const parts: string[] = languageCode.split("-");

  // Take the last part if it exists, otherwise use the original code
  let countryCode: string =
    parts.length > 1 ? parts[parts.length - 1] : languageCode;

  // Convert to uppercase
  countryCode = countryCode.toUpperCase();

  // Special rule: if code is "EN", return "GB"
  if (countryCode === "EN") {
    return "GB";
  }

  return countryCode;
}
