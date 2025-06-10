import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createShowtimeSchema, ICreateShowtimeDto } from './dto/showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  createShowtime(
    @Body(new ZodValidationPipe(createShowtimeSchema)) createShowtimeDto: ICreateShowtimeDto,
  ) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get()
  getShowtimes() {
    return this.showtimesService.findAll();
  }

  @Get('/search')
  findByMovieAndTheater(@Query('movieId') movieId: string, @Query('theaterId') theaterId: string) {
    return this.showtimesService.findByMovieAndTheater(movieId, theaterId);
  }
}
