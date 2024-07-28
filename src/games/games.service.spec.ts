import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService],
      controllers: [GamesController],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
