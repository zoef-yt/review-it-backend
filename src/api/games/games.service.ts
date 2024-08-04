import axios from 'axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { RawgGame } from './interface/game.interface';
import { FetchGamesResponseDto, GameDto } from './dto/game.dto';

@Injectable()
export class GamesService {
  async fetchGames(page_size: number, page: number, search: string = null): Promise<FetchGamesResponseDto> {
    try {
      const response = await axios.get(process.env.RAWG_API_URL, {
        params: {
          key: process.env.RAWG_API_KEY,
          page_size,
          page,
          search,
          ordering: '-metacritic, -rating',
          exclude_stores: '9,8,6,5,4',
          parent_platforms: '1,2,3,6',
          search_precise: true,
        },
        validateStatus: (status) => status >= 200 && status < 300,
      });
      const games: GameDto[] = response.data.results.map(this.mapToGameDto);
      return { count: games.length, results: games };
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async fetchSingleGame(slug: string): Promise<GameDto> {
    try {
      const response = await axios.get(`${process.env.RAWG_API_URL}/${slug}`, {
        params: {
          key: process.env.RAWG_API_KEY,
        },
      });
      return this.mapToGameDto(response.data);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  private handleApiError(error: any): never {
    if (error.response) {
      throw new HttpException(`RAWG API error: ${error.response.statusText}`, error.response.status);
    } else if (error.request) {
      throw new HttpException('No response received from RAWG API', HttpStatus.GATEWAY_TIMEOUT);
    } else {
      throw new HttpException('An error occurred while fetching data from RAWG API', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private mapToGameDto(game: RawgGame): GameDto {
    return {
      id: game.id,
      slug: game.slug,
      name: game.name,
      released: game.released,
      tba: game.tba,
      backgroundImage: game.background_image,
      rating: game.rating,
      ratingTop: game.rating_top,
      playtime: game.playtime,
      platforms:
        game.platforms?.map((p) => ({
          id: p.platform.id,
          name: p.platform.name,
          slug: p.platform.slug,
        })) || [],
      stores:
        game.stores?.map((s) => ({
          id: s.store.id,
          name: s.store.name,
          slug: s.store.slug,
        })) || [],
      genres:
        game.genres?.map((g) => ({
          id: g.id,
          name: g.name,
          slug: g.slug,
        })) || [],
      esrbRating: game.esrb_rating
        ? {
            id: game.esrb_rating.id,
            name: game.esrb_rating.name,
            slug: game.esrb_rating.slug,
            name_en: game.esrb_rating.name_en,
            name_ru: game.esrb_rating.name_ru,
          }
        : null,
      description: game.description_raw || '',
      alternativeNames: game.alternative_names || [],
      website: game.website || '',
      nameOriginal: game.name_original || '',
      shortScreenshots:
        game.short_screenshots?.map((ss) => ({
          id: ss.id,
          image: ss.image,
        })) || [],
      parentPlatforms:
        game.parent_platforms?.map((pp) => ({
          platform: {
            id: pp.platform.id,
            name: pp.platform.name,
            slug: pp.platform.slug,
          },
        })) || [],
    };
  }
}
