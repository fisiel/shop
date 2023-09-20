import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.util';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  public cart: Cart;

  @ManyToOne(() => Product, (product) => product.cart_items)
  public product: Product;

  @Column('int4')
  public quantity: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  public sum: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  @Exclude()
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  @Exclude()
  public updated_at: Date;
}
