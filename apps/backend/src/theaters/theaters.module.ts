import { Module } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Theater])],
  providers: [TheatersService],
  controllers: [TheatersController],
  exports: [TheatersService],
})
export class TheatersModule {}
