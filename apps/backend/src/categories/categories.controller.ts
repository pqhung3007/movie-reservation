import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CategoriesService } from './categories.service';
import {
  createCategorySchema,
  ICreateCategoryDto,
} from './dto/create-category.dto';
import {
  IUpdateCategoryDto,
  updateCategorySchema,
} from './dto/update-category.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../common/roles.enum';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async createCategory(createCategoryDto: ICreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async getAllCategories() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  async updateCategory(
    @Param('id') id: string,
    updateCategoryDto: IUpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.remove(id);
  }
}
