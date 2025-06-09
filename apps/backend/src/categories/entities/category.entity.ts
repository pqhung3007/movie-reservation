import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Movie, (movie) => movie.category)
  movies: Movie[];
}
