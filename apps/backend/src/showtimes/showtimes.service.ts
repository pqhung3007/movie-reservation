import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { Repository } from 'typeorm';
import { Theater } from '../theaters/entities/theater.entity';
import { Movie } from '../movies/entities/movie.entity';
import { ICreateShowtimeDto } from './dto/showtime.dto';
import { generateSeatMap } from './utils';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime) private readonly showRepo: Repository<Showtime>,
    @InjectRepository(Theater) private readonly theaterRepo: Repository<Theater>,
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
  ) {}

  async create(data: ICreateShowtimeDto) {
    const { movieId, theaterId, startTime } = data;

    const movie = await this.movieRepo.findOne({ where: { id: movieId } });
    const theater = await this.theaterRepo.findOne({
      where: { id: theaterId }, // fixed: used movieId incorrectly
      relations: ['showtimes'],
    });

    if (!theater || !movie) {
      throw new NotFoundException('Movie or theater not found');
    }

    const showDate = new Date(startTime);
    const showDateStr = showDate.toISOString().split('T')[0];

    const sameDayShowtimes = await this.showRepo
      .createQueryBuilder('showtime')
      .leftJoin('showtime.movie', 'movie')
      .leftJoin('showtime.theater', 'theater')
      .where('DATE(showtime.startTime) = :date', { date: showDateStr })
      .andWhere('showtime.theater = :theaterId', { theaterId })
      .getMany();

    console.log('aaa', sameDayShowtimes);

    // Enforce limits per theater per day
    const distinctMovieIds = new Set(sameDayShowtimes.map((s) => s.movie.id));
    if (!distinctMovieIds.has(movieId)) {
      if (distinctMovieIds.size >= theater.dailyMovieLimit) {
        throw new BadRequestException('This theater has reached its daily movie limit');
      }
    }

    if (sameDayShowtimes.length >= theater.dailyShowtimeLimit) {
      throw new BadRequestException('This theater has reached its daily showtime limit');
    }

    // Check movie availability window
    if (
      movie.availableFrom &&
      movie.availableUntil &&
      (showDate < movie.availableFrom || showDate > movie.availableUntil)
    ) {
      throw new BadRequestException('Movie is not available at this time');
    }

    // ✅ Generate seat map (A1–H8)
    const seatMap = generateSeatMap();

    const newShowtime = this.showRepo.create({
      startTime: new Date(startTime),
      movie,
      theater,
      seatMap,
    });

    return this.showRepo.save(newShowtime);
  }

  findAll() {
    return this.showRepo.find({ relations: ['movie', 'theater'] });
  }

  findByMovieAndTheater(movieId: string, theaterId: string) {
    return this.showRepo.find({
      where: {
        movie: { id: movieId },
        theater: { id: theaterId },
      },
      relations: ['movie', 'theater'],
      order: { startTime: 'ASC' },
    });
  }

  async getAvailableSeats(showtimeId: string) {
    const showTime = await this.showRepo.findOne({ where: { id: showtimeId } });
    if (!showTime) {
      throw new NotFoundException('Showtime not found');
    }

    const availableSeats = showTime.seatMap.filter((seat) => !seat.isReserved);
    return {
      showtimeId,
      totalSeats: showTime.seatMap.length,
      availableSeats,
    };
  }
}
