import { Injectable, NotFoundException } from '@nestjs/common';
import { Reservation } from '../reservations/entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Showtime) private readonly showtimeRepo: Repository<Showtime>,
    private readonly mailerService: MailerService,
  ) {}

  async sendConfirmationEmail(reservation: Reservation) {
    const user = await this.userRepo.findOne({ where: { id: reservation.user.id } });
    const showtime = await this.showtimeRepo.findOne({
      where: { id: reservation.showtime.id },
      relations: ['movie', 'theater'],
    });

    if (!user || !showtime) {
      throw new NotFoundException('User or Showtime not found');
    }

    await this.mailerService.sendMail({
      to: user.email,
      subject: '🎟️ Reservation Confirmation',
      template: 'reservation', // reservation.hbs or reservation.pug in /templates
      context: {
        name: user.fullName,
        movie: showtime.movie.title,
        theater: showtime.theater.name,
        seat: reservation.seatNumber,
        time: showtime.startTime.toLocaleDateString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    });
  }
}
