export type Manxa = {
  title: string;
  url: string;
  img: string;
  newestChapter?: string;
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

export type Chapter = {
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

export type ChapterImageUrlsResponse = {
  success: boolean;
  data: ChapterImageUrl[];
};

export type ManageListResponse = {
  success: boolean;
  message: string;
};

type List = {
  name: string;
  created_at: string;
};

export type FetchListsResponse = {
  success: boolean;
  lists: List[];
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

type Favorite = {
  title: string;
  manxa_url: string;
  created_at: string;
};

export type FetchFavoritesResponse = {
  success: boolean;
  list: string;
  favorites: Favorite[];
};

export type RemoveFavoriteResponse = {
  results: [
    {
      manxa_url: string;
      list_name: string;
      success: boolean;
      status: number;
      messsage: string;
    }
  ];
};

export type ManageChapterProgressResponse = {
  results: [
    {
      manxa_url: string;
      chapter_url: string;
      success: boolean;
      status: number;
      message: string;
    }
  ];
};

export type FetchChapterProgressResponse = {
  success: boolean;
  read_chapters: string[];
};

export type HistoryElement = {
  manxa_url: string;
  chapter_url: string;
  read_at: string;
};

export type FetchHistoryResponse = {
  success: boolean;
  history: HistoryElement[];
};
