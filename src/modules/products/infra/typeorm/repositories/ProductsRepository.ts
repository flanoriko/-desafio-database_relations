import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import { inject } from 'tsyringe';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });
    await this.ormRepository.save(product);
    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const findAllproducts = await this.ormRepository.find({
      where: { id: In(productsIds) },
    });

    return findAllproducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // procura todos os IDs no repositorio com aquele ID

    /*   const productsIds = products.map(product => product.id);

    const findAllproducts = await this.ormRepository.find({
      where: { id: In(productsIds) },
    });
    let i;
    let newQuantity;

    for (i = 0; i < findAllproducts.length; i++) {
      const { quantity } = findAllproducts[i];

      for (i = 0; i < products.length; i++) {
        newQuantity = quantity - products[i].quantity;
        findAllproducts[i].quantity = newQuantity;
      }
    }

    await this.ormRepository.save(findAllproducts);
*/
    const findAllproducts = await this.ormRepository.save(products);

    return findAllproducts;
  }
}

export default ProductsRepository;
