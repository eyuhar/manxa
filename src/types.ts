export type Manxa = {
    title: string;
    url: string;
    img: string;
    newestChapter: string;
    summary?: string;
}

export type ManxaListResponse = {
    success: boolean;
    data: {
        totalResults: number;
        totalPages: number;
        results: Manxa[];
    };
}

type Chapter = {
    chapter: string;
    chapterUrl: string;
    chapterViews: number;
    chapterUploadTime: string;
}

export type ManxaDetailed = {
    img: string;
    title: string;
    authors: string;
    status: string;
    lastUpdate: string;
    views: number;
    genres: string[];
    rating: string;
    summary: string;
    chapters: Chapter[];
}

export type ManxaDetailedResponse = {
    success: boolean;
    data: ManxaDetailed;
}

type ChapterImageUrl = string;

export type ChapterImageUrlsReponse = {
    success: boolean;
    data: ChapterImageUrl[];
}