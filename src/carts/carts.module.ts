import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';

import { Product } from '../products/product.entity';
import { ProductsService } from '../products/products.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Cart]),
    TypeOrmModule.forFeature([CartItem]),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [CartsController],
  providers: [CartsService, ProductsService],
  exports: [CartsService, TypeOrmModule],
})
export class CartsModule {}
