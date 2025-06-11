import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from '../theaters/entities/theater.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie, Theater])],
  providers: [ShowtimesService],
  controllers: [ShowtimesController],
  exports: [ShowtimesService, TypeOrmModule],
})
export class ShowtimesModule {}
