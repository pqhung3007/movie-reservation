import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ICreateCategoryDto } from './dto/create-category.dto';
import { IUpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>) {}

  async create(createCategoryDto: ICreateCategoryDto) {
    return this.categoryRepo.create(createCategoryDto);
  }

  async findAll() {
    return this.categoryRepo.find({ select: ['id', 'name'] });
  }

  async findOne(id: string) {
    return this.categoryRepo.findOne({
      where: { id },
      select: ['id', 'name'],
    });
  }

  async update(id: string, updateCategoryDto: IUpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);

    Object.assign(category, updateCategoryDto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException(`Category with id ${id} not found`);

    return this.categoryRepo.remove(category);
  }
}
