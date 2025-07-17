export type Manxa = {
  title: string;
  url: string;
  img: string;
  newestChapter: string;
  summary?: string;
};

export type ManxaListResponse = {
  success: boolean;
  data: {
    totalResults: number;
    totalPages: number;
    results: Manxa[];
  };
};

type Chapter = {
  chapter: string;
  chapterUrl: string;
  chapterViews: number;
  chapterUploadTime: string;
};

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
};

export type ManxaDetailedResponse = {
  success: boolean;
  data: ManxaDetailed;
};

type ChapterImageUrl = string;

export type ChapterImageUrlsReponse = {
  success: boolean;
  data: ChapterImageUrl[];
};

export type AddListResponse = {
  success: boolean;
  message: string;
};

export type list = {
  name: string;
  created_at: string;
};

export type FetchListsResponse = {
  success: boolean;
  lists: list[];
};

export type AddFavoriteResponse = {
  results: [
    {
      title: string;
      manxa_url: string;
      success: boolean;
      status: number;
      message: string;
    }
  ];
};
