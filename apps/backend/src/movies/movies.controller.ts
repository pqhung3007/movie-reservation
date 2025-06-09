import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { filterMovieSchema, IFilterMovieDto } from './dto/filter-movie.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createMovieSchema, ICreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(filterMovieSchema))
  findAll(@Query() filter: IFilterMovieDto) {
    return this.movieService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(createMovieSchema)) createMovieDto: ICreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMovieDto: any) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
