export class PlatformDto {
  id: number;
  name: string;
  slug: string;
}

export class StoreDto {
  id: number;
  name: string;
  slug: string;
}

export class GenreDto {
  id: number;
  name: string;
  slug: string;
}

export class ESRBRatingDto {
  id: number;
  name: string;
  slug: string;
  name_en: string;
  name_ru: string;
}

export class ScreenshotDto {
  id: number;
  image: string;
}

export class ParentPlatformDto {
  platform: PlatformDto;
}

export class GameDto {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  backgroundImage: string;
  rating: number;
  ratingTop: number;
  playtime: number;
  platforms: PlatformDto[];
  stores: StoreDto[];
  genres: GenreDto[];
  esrbRating: ESRBRatingDto;
  description: string;
  alternativeNames: string[];
  website: string;
  nameOriginal: string;
  shortScreenshots: ScreenshotDto[];
  parentPlatforms: ParentPlatformDto[];
}

export class FetchGamesResponseDto {
  count: number;
  results: GameDto[];
}
