import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(+process.env['MAX_CART_ITEM_QUANTITY'])
  quantity: number;
}
