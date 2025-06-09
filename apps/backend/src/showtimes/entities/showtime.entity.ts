import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from '../../theaters/entities/theater.entity';

@Entity()
export class Showtime extends BaseEntity {
  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Theater, (theater) => theater.showtimes)
  theater: Theater;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;
}
