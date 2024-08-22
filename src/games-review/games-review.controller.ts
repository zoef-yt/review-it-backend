import { Body, Controller, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { GamesReviewService } from './games-review.service';
import { CreateGamesReviewDto } from './dto/create-games-review.dto';

@Controller('games-review')
export class GamesReviewController {
  constructor(private readonly gamesReviewService: GamesReviewService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Request() req, @Body() createGamesReviewDto: CreateGamesReviewDto) {
    const userIdFromToken = req.user._id;
    const userIdFromRequest = createGamesReviewDto.userID;
    if (userIdFromToken !== userIdFromRequest) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
    return this.gamesReviewService.createReview(createGamesReviewDto);
  }
}
