import {
  Controller,
  Param,
  Post,
  Get,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';

import { CartsService } from './carts.service';
import { Cart } from './cart.entity';

import { UuidParam } from '../utils/params/uuid.param';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartItemParam } from './params/cart-item.param';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './cart-item.entity';

@Controller('carts')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Post()
  addOne(): Promise<Cart> {
    return this.cartsService.addOne();
  }

  @Get('/:id')
  getOne(@Param() cartIdParam: UuidParam): Promise<Cart> {
    return this.cartsService.getOne(cartIdParam);
  }

  @Delete('/:id')
  deleteOne(@Param() cartIdParam: UuidParam): Promise<void> {
    return this.cartsService.deleteOne(cartIdParam);
  }

  @Post('/:id/items')
  addOneItem(
    @Param() cartIdParam: UuidParam,
    @Body() addCartItemDto: AddCartItemDto,
  ): Promise<CartItem> {
    return this.cartsService.addOneItem(cartIdParam, addCartItemDto);
  }

  @Get('/:id/items')
  getAllItems(@Param() cartIdParam: UuidParam): Promise<CartItem[]> {
    return this.cartsService.getAllItems(cartIdParam);
  }

  @Get('/:cart_id/items/:item_id')
  getOneItem(@Param() cartItemParam: CartItemParam): Promise<CartItem> {
    return this.cartsService.getOneItem(cartItemParam);
  }

  @Patch('/:cart_id/items/:item_id')
  updateOneItem(
    @Param() cartItemParam: CartItemParam,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return this.cartsService.updateOneItem(cartItemParam, updateCartItemDto);
  }

  @Delete('/:id/items/')
  deleteAllItems(@Param() cartIdParam: UuidParam): Promise<void> {
    return this.cartsService.deleteAllItems(cartIdParam);
  }

  @Delete('/:cart_id/items/:item_id')
  deleteOneItem(@Param() cartItemParam: CartItemParam): Promise<void> {
    return this.cartsService.deleteOneItem(cartItemParam);
  }
}
