import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { Product } from './product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { UuidParam } from '../utils/params/uuid.param';
import { ProductsListPageQuery } from './queries/products-list-page.query';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  addOne(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.addOne(createProductDto);
  }

  @Get('/:id')
  getOne(@Param() idParam: UuidParam): Promise<Product> {
    return this.productsService.getOne(idParam);
  }

  @Get()
  getAll(
    @Query() productsListPageQuery: ProductsListPageQuery,
  ): Promise<Product[]> {
    return this.productsService.getAll(productsListPageQuery);
  }

  @Patch('/:id')
  updateOne(
    @Param() idParam: UuidParam,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateOne(idParam, updateProductDto);
  }

  @Delete('/:id')
  deleteOne(@Param() idParam: UuidParam): Promise<void> {
    return this.productsService.deleteOne(idParam);
  }
}
