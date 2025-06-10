import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';
import { Repository } from 'typeorm';
import { ICreateTheaterDto, IUpdateTheaterDto } from './dto/theater.dto';

@Injectable()
export class TheatersService {
  constructor(@InjectRepository(Theater) private readonly theaterRepo: Repository<Theater>) {}

  create(createTheaterDto: ICreateTheaterDto) {
    const theater = this.theaterRepo.create(createTheaterDto);
    return this.theaterRepo.save(theater);
  }

  findAll() {
    return this.theaterRepo.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['showtimes'],
    });
  }

  findOne(id: string) {
    return this.theaterRepo.findOne({
      where: { id },
      relations: ['showtimes'],
    });
  }

  async update(id: string, updateTheaterDto: IUpdateTheaterDto) {
    const theater = await this.findOne(id);
    if (!theater) throw new NotFoundException(`Theater with id ${id} not found`);
    Object.assign(theater, updateTheaterDto);

    return this.theaterRepo.save(theater);
  }

  async remove(id: string) {
    const theater = await this.findOne(id);
    if (!theater) throw new NotFoundException(`Theater with id ${id} not found`);

    return this.theaterRepo.remove(theater);
  }

  async findTheaterByMovie(movieId: string) {
    return await this.theaterRepo
      .createQueryBuilder('theater')
      .leftJoin('theater.showtimes', 'showtime')
      .leftJoin('showtime.movie', 'movie')
      .where('movie.id = :movieId', { movieId })
      .distinct(true)
      .getMany();
  }
}
