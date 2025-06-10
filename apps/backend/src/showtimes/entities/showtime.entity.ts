import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from '../../theaters/entities/theater.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity()
export class Showtime extends BaseEntity {
  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Theater, (theater) => theater.showtimes)
  theater: Theater;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column('jsonb', { default: () => "'[]'" })
  seatMap: { seatNumber: string; isReserved: boolean }[];

  @OneToMany(() => Reservation, (reservation) => reservation.showtime, { cascade: true })
  reservations: Reservation[];
}
