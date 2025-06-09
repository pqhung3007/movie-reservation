import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { IFilterMovieDto } from './dto/filter-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private readonly moviesRepo: Repository<Movie>) {}

  async findAll(filter: IFilterMovieDto) {
    const { category, title, page, limit } = filter;

    const queryBuilder = this.moviesRepo
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.category', 'category');

    if (title) {
      queryBuilder.andWhere('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (category) {
      queryBuilder.andWhere('LOWER(category.name) = LOWER(:category)', {
        category,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const movie = await this.moviesRepo.findOne({
      where: { id },
    });
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);

    return movie;
  }

  create(createMovieDto: any) {
    const movie = this.moviesRepo.create({
      ...createMovieDto,
    });
    return this.moviesRepo.save(movie);
  }

  async update(id: string, updateMovieDto: any) {
    const movie = await this.findOne(id);
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);
    const updatedMovie = {
      ...movie,
      ...updateMovieDto,
    };

    return this.moviesRepo.save(updatedMovie);
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);
    
    return this.moviesRepo.remove(movie);
  }
}
