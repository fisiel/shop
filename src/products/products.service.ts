import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Product } from './product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { UuidParam } from '../utils/params/uuid.param';

import { ProductsListPageQuery } from './queries/products-list-page.query';

import { InitialProductsData } from './products.data';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async seed() {
    for (let i = 0; i < InitialProductsData.length; i++) {
      const productEntity = this.productsRepository.create(
        InitialProductsData[i],
      );

      try {
        await this.productsRepository.save(productEntity);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
  }

  async addOne(createProductDto: CreateProductDto): Promise<Product> {
    const { title, price } = createProductDto;

    const product = this.productsRepository.create({
      title,
      price,
    });

    try {
      await this.productsRepository.save(product);
    } catch (e) {
      if (/(title)[\s\S]+(already exists)/.test(e.detail)) {
        throw new ConflictException(
          `Product with title '${title}' already exists`,
        );
      }
      throw new InternalServerErrorException(e);
    }

    return product;
  }

  async getOne(productIdParam: UuidParam): Promise<Product> {
    const { id } = productIdParam;

    const product = await this.productsRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id '${id}' does not exist`);
    }

    return product;
  }

  async getAll(
    productsListPageQuery: ProductsListPageQuery,
  ): Promise<Product[]> {
    const page = productsListPageQuery?.page ?? 1;

    const productsPerPage = +process.env['PRODUCTS_PER_PAGE'];

    return this.productsRepository.find({
      take: productsPerPage,
      skip: productsPerPage * (page - 1),
    });
  }

  async updateOne(
    productIdParam: UuidParam,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { title, price } = updateProductDto;

    if (!title && !price) {
      throw new BadRequestException(`No update parameters provided`);
    }

    const product = await this.getOne(productIdParam);

    let changed: boolean = false;

    if (title && title !== product.title) {
      product.title = title;
      changed = true;
    }

    if (price && price !== product.price) {
      product.price = price;
      changed = true;
    }

    if (!changed) {
      return product;
    }

    try {
      await this.productsRepository.save(product);
    } catch (e) {
      if (/(title)[\s\S]+(already exists)/.test(e.detail)) {
        throw new ConflictException(
          `Product with title '${title}' already exists`,
        );
      }
      throw new InternalServerErrorException(e);
    }

    return product;
  }

  async deleteOne(productIdParam: UuidParam): Promise<void> {
    const { id } = productIdParam;

    const result = await this.productsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
  }
}
