import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Theater extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: 5 })
  dailyMovieLimit: number;

  @Column({ default: 10 })
  dailyShowtimeLimit: number;

  @OneToMany(() => Showtime, (showtime) => showtime.theater)
  showtimes: Showtime[];
}
