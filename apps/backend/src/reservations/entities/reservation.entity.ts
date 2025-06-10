import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Reservation extends BaseEntity {
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Showtime, (showtime) => showtime.reservations)
  showtime: Showtime;

  @Column()
  seatNumber: string;

  @Column({ default: false })
  isPaid: boolean;
}
