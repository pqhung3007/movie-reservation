import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createReservationSchema, ICreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async reserve(
    @Body(new ZodValidationPipe(createReservationSchema))
    createReservationDto: ICreateReservationDto,
  ) {
    return this.reservationsService.create(createReservationDto);
  }

  @Delete(':id')
  async cancelReservation(@Param('id') id: string) {
    return this.reservationsService.cancelReservation(id);
  }
}
