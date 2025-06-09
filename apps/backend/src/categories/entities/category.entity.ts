import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;
}
