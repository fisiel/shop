import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';

import { ProductsService } from '../products/products.service';

import { UuidParam } from '../utils/params/uuid.param';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartItemParam } from './params/cart-item.param';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Cart) private cartsRepository: Repository<Cart>,
    private productsService: ProductsService,
  ) {}

  async addOne(): Promise<Cart> {
    const cart = this.cartsRepository.create({ sum: 0 });

    try {
      await this.cartsRepository.save(cart);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return cart;
  }

  async getOne(cartIdParam: UuidParam): Promise<Cart> {
    const { id } = cartIdParam;

    const cart = await this.cartsRepository.findOne({
      relations: {
        items: true,
      },
      where: {
        id,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id '${id}' does not exist`);
    }

    return cart;
  }

  async getOneWithoutRelations(cartIdParam: UuidParam): Promise<Cart> {
    const { id } = cartIdParam;

    const cart = await this.cartsRepository.findOne({
      where: {
        id,
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id '${id}' does not exist`);
    }

    return cart;
  }

  async deleteOne(cartIdParam: UuidParam): Promise<void> {
    await this.deleteAllItems(cartIdParam);

    await this.cartsRepository.delete({ id: cartIdParam.id });
  }

  async addOneItem(
    cartIdParam: UuidParam,
    addCartItemDto: AddCartItemDto,
  ): Promise<CartItem> {
    const { id } = cartIdParam;

    const cart = await this.getOneWithoutRelations(cartIdParam);

    const { product_id, quantity } = addCartItemDto;

    const product = await this.productsService.getOne({ id: product_id });

    const cartItems = await this.cartItemsRepository.find({
      relations: { product: true },
      where: { cart: { id } },
    });

    if (cartItems.length === +process.env['MAX_CART_ITEMS']) {
      throw new ConflictException(
        `Cart with id '${id}' already contains max items count`,
      );
    }

    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].product.id === product_id) {
        throw new ConflictException(
          `Product with id '${product_id}' is already added to the cart with id '${id}'`,
        );
      }
    }

    const sum = product.price * quantity;

    cart.sum += sum;

    const cartItem = await this.cartItemsRepository.create({
      product,
      quantity,
      cart,
      sum,
    });

    try {
      await this.cartItemsRepository.save(cartItem);
      await this.cartsRepository.save(cart);
    } catch (e) {
      throw new InternalServerErrorException(e.detail);
    }

    return cartItem;
  }

  async getAllItems(cartIdParam: UuidParam): Promise<CartItem[]> {
    const cart = await this.getOneWithoutRelations(cartIdParam);

    const cartItems = await this.cartItemsRepository.find({
      relations: {
        product: true,
      },
      where: {
        cart: { id: cart.id },
      },
    });

    return cartItems;
  }

  async getOneItem(cartItemParam: CartItemParam): Promise<CartItem> {
    const { cart_id, item_id } = cartItemParam;

    // Check if cart exist
    await this.getOneWithoutRelations({ id: cart_id });

    const cartItem = await this.cartItemsRepository.findOne({
      relations: {
        product: true,
      },
      where: {
        id: item_id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Item with id '${item_id}' does not exist on cart with id '${cart_id}'`,
      );
    }

    return cartItem;
  }

  async updateOneItem(
    cartItemParam: CartItemParam,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const { product_id, quantity } = updateCartItemDto;

    if (!product_id && !quantity) {
      throw new BadRequestException(`No update parameters provided`);
    }

    const cart = await this.getOneWithoutRelations({
      id: cartItemParam.cart_id,
    });

    const product = await this.productsService.getOne({ id: product_id });

    const cartItem = await this.getOneItem(cartItemParam);

    let changed: boolean = false;

    if (product_id && product_id !== cartItem.product.id) {
      cartItem.product = product;
      cartItem.quantity = 1;
      changed = true;
    }

    if (quantity && quantity !== cartItem.quantity) {
      cartItem.quantity = quantity;
      changed = true;
    }

    if (!changed) {
      return cartItem;
    }

    cart.sum -= cartItem.sum;

    cartItem.sum = product.price * quantity;

    cart.sum += cartItem.sum;

    try {
      await this.cartItemsRepository.save(cartItem);
      await this.cartsRepository.save(cart);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return cartItem;
  }

  async deleteOneItem(cartItemParam: CartItemParam): Promise<void> {
    const { cart_id, item_id } = cartItemParam;

    const cart = await this.getOneWithoutRelations({ id: cart_id });

    const cartItem = await this.getOneItem(cartItemParam);

    cart.sum -= cartItem.product.price * cartItem.quantity;

    await this.cartItemsRepository.delete({ id: item_id, cart });

    try {
      await this.cartsRepository.save(cart);
    } catch (e) {
      throw new InternalServerErrorException(e.detail);
    }
  }

  async deleteAllItems(cartIdParam: UuidParam): Promise<void> {
    const cart = await this.getOneWithoutRelations(cartIdParam);

    cart.sum = 0;

    await this.cartItemsRepository.delete({ cart });

    try {
      await this.cartsRepository.save(cart);
    } catch (e) {
      throw new InternalServerErrorException(e.detail);
    }
  }
}
