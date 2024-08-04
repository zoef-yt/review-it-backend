interface RawgPlatform {
  id: number;
  name: string;
  slug: string;
}

interface RawgStore {
  id: number;
  name: string;
  slug: string;
}

interface RawgGenre {
  id: number;
  name: string;
  slug: string;
}

interface RawgEsrbRating {
  id: number;
  name: string;
  slug: string;
  name_en: string;
  name_ru: string;
}

interface RawgScreenshot {
  id: number;
  image: string;
}

interface RawgParentPlatform {
  platform: RawgPlatform;
}

export interface RawgGame {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  playtime: number;
  platforms: { platform: RawgPlatform }[];
  stores: { store: RawgStore }[];
  genres: RawgGenre[];
  esrb_rating: RawgEsrbRating | null;
  description_raw?: string;
  alternative_names?: string[];
  website?: string;
  name_original?: string;
  short_screenshots: RawgScreenshot[];
  parent_platforms: RawgParentPlatform[];
}
