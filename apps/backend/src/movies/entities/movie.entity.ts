import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Movie extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  releaseDate: Date;

  @Column('int')
  duration: number; // Duration in minutes

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.movies, { eager: false, nullable: false })
  category: Category;
}
