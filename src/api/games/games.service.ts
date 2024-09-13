import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

import { FetchGamesQueryDto } from './dto/fetchGames.dto';
import { GameDto, QueryParams, RawgGame } from './interface/game.interface';

@Injectable()
export class GamesService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RAWG_API_KEY');
    this.apiUrl = this.configService.get<string>('RAWG_API_URL');
  }

  async fetchGames(fetchGamesQueryDto: FetchGamesQueryDto): Promise<{ count: number; results: GameDto[] }> {
    try {
      const params = this.buildQueryParams(fetchGamesQueryDto);
      const response = await this.makeApiRequest<{ results: RawgGame[] }>(this.apiUrl, params);
      const games = this.processGames(response.data.results, fetchGamesQueryDto.skipFilter);
      return { count: games.length, results: games };
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async fetchSingleGame(slug: string): Promise<GameDto> {
    try {
      const response = await this.makeApiRequest<RawgGame>(`${this.apiUrl}/${slug}`, { key: this.apiKey });
      return this.mapToGameDto(response.data);
    } catch (error) {
      this.handleApiError(error);
    }
  }

  private buildQueryParams(queryDto: FetchGamesQueryDto): QueryParams {
    const { page, page_size, search, ordering, dateRange } = queryDto;
    return {
      key: this.apiKey,
      page_size,
      page: page ?? 1,
      ordering: ordering ? `${ordering},-metacritic,-rating` : '-metacritic,-rating',
      exclude_stores: '9,8,6,5,4',
      parent_platforms: '1,2,3,6',
      dates: dateRange ?? undefined,
      ...(search ? { search_precise: true, search } : {}),
    };
  }

  private async makeApiRequest<T>(url: string, params: Record<string, any>): Promise<AxiosResponse<T>> {
    return axios.get<T>(url, {
      params,
      validateStatus: (status) => status >= 200 && status < 300,
    });
  }

  private processGames(games: RawgGame[], skipFilter: boolean): GameDto[] {
    return skipFilter ? games.map(this.mapToGameDto) : this.filterGames(games).map(this.mapToGameDto);
  }

  private filterGames(games: RawgGame[]): RawgGame[] {
    return games
      .filter((game) => game.background_image !== null)
      .sort((a, b) => new Date(b.released).getTime() - new Date(a.released).getTime())
      .filter((game) => game.rating === null || game.rating > 0);
  }

  private handleApiError(error: any): never {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new HttpException(`RAWG API error: ${error.response.statusText}`, error.response.status);
      } else if (error.request) {
        throw new HttpException('No response received from RAWG API', HttpStatus.GATEWAY_TIMEOUT);
      }
    }
    throw new HttpException('An error occurred while fetching data from RAWG API', HttpStatus.INTERNAL_SERVER_ERROR);
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
      platforms: game.platforms?.map((p) => p.platform) ?? [],
      stores: game.stores?.map((s) => s.store) ?? [],
      genres: game.genres ?? [],
      esrbRating: game.esrb_rating,
      description: game.description_raw ?? '',
      alternativeNames: game.alternative_names ?? [],
      website: game.website ?? '',
      nameOriginal: game.name_original ?? '',
      shortScreenshots: game.short_screenshots ?? [],
      parentPlatforms: game.parent_platforms ?? [],
    };
  }
}
