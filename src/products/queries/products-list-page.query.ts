import { IsNumberString, IsOptional } from 'class-validator';

export class ProductsListPageQuery {
  @IsOptional()
  @IsNumberString()
  page: number;
}
