import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';

import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/cart.entity';
import { CartItem } from './carts/cart-item.entity';

import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: +process.env['DB_PORT'],
      username: process.env['DB_USER'],
      password: process.env['DB_PASSWD'],
      database: process.env['DB_NAME'],
      entities: [Product, Cart, CartItem],
      synchronize: true,
    }),
    ProductsModule,
    CartsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
