import { Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  constructor(private productsService: ProductsService) {}

  async seed() {
    await this.productsService.seed();
  }
}
