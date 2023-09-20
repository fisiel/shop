import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsOptional()
  @IsUUID()
  product_id: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(+process.env['MAX_CART_ITEM_QUANTITY'])
  quantity: number;
}
