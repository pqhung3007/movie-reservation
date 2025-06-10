import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateReservationDto } from './dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Showtime) private readonly showTimeRepo: Repository<Showtime>,
  ) {}

  async create(createReservationDto: ICreateReservationDto) {
    const { showtimeId, userId, seat } = createReservationDto;

    const showtime = await this.showTimeRepo.findOne({ where: { id: showtimeId } });
    if (!showtime) {
      throw new BadRequestException('Showtime not found');
    }

    const seatMap = showtime.seatMap;

    const searIndex = seatMap.findIndex((s) => s.seatNumber === seat);
    if (searIndex === -1) {
      throw new BadRequestException('Invalid seat number');
    }

    if (seatMap[searIndex].isReserved) {
      throw new BadRequestException('Seat is already reserved');
    }

    // reserve seat
    seatMap[searIndex].isReserved = true;
    showtime.seatMap = seatMap;
    await this.showTimeRepo.save(showtime);

    const reservation = this.reservationRepo.create({
      user: { id: userId },
      showtime: { id: showtimeId },
      seatNumber: seat,
    });

    return this.reservationRepo.save(reservation);
  }

  async cancelReservation(id: string) {
    const reservation = await this.reservationRepo.findOne({
      where: { id },
      relations: ['showtime'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Update the seat to be available again
    const showtime = reservation.showtime;
    showtime.seatMap = showtime.seatMap.map((seat) =>
      seat.seatNumber === reservation.seatNumber ? { ...seat, isReserved: false } : seat,
    );
    await this.showTimeRepo.save(showtime);

    // Delete the reservation
    await this.reservationRepo.remove(reservation);

    return { message: 'Reservation canceled and seat released.' };
  }
}
