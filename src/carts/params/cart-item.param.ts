import { IsUUID } from 'class-validator';

export class CartItemParam {
  @IsUUID()
  cart_id: string;

  @IsUUID()
  item_id: number;
}
