import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createTheaterSchema,
  ICreateTheaterDto,
  IUpdateTheaterDto,
  updateTheaterSchema,
} from './dto/theater.dto';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Post()
  createTheater(
    @Body(new ZodValidationPipe(createTheaterSchema)) createTheaterDto: ICreateTheaterDto,
  ) {
    return this.theatersService.create(createTheaterDto);
  }

  @Get()
  findAll() {
    return this.theatersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theatersService.findOne(id);
  }

  @Patch(':id')
  updateTheater(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTheaterSchema)) updateTheaterDto: IUpdateTheaterDto,
  ) {
    return this.theatersService.update(id, updateTheaterDto);
  }

  @Delete(':id')
  removeTheater(@Param('id') id: string) {
    return this.theatersService.remove(id);
  }

  @Get('/get-by-movie')
  findTheaterByMovie(@Query('movieId') movieId: string) {
    return this.theatersService.findTheaterByMovie(movieId);
  }
}
