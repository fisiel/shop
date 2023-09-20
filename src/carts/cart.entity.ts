import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  Column,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Exclude } from 'class-transformer';
import { ColumnNumericTransformer } from '../utils/column-numeric-transformer.util';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  @JoinColumn()
  public items: CartItem[];

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
