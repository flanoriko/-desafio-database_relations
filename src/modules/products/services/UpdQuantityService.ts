import { inject, injectable } from 'tsyringe';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
  quantity: number;
}

@injectable()
class UpdQuantityService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(products: IRequest[]): Promise<Product[]> {
    const productUpd = this.productsRepository.updateQuantity(products);
    return productUpd;
  }
}

export default UpdQuantityService;
