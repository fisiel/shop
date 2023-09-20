import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.util';

import { CartItem } from '../carts/cart-item.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public title: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  public price: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  public cart_items: CartItem[];

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
