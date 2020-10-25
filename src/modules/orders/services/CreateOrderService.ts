import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not exists');
    }

    const productsExists = await this.productsRepository.findAllById(products);

    if (!productsExists.length) {
      throw new AppError('Product not exists');
    }

    const productsExistsIds = productsExists.map(product => product.id);
    const productsNotRegistered = products.filter(
      product => !productsExistsIds.includes(product.id),
    );

    if (productsNotRegistered.length) {
      throw new AppError(
        `Could not find product ${productsNotRegistered[0].id}`,
      );
    }

    const produtctsWithWrongQty = products.filter(
      prod1 =>
        productsExists.filter(p => p.id === prod1.id)[0].quantity <
        prod1.quantity,
    );

    if (produtctsWithWrongQty.length) {
      throw new AppError(`Wrong quantity: ${produtctsWithWrongQty[0].id}`);
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsExists.filter(p => p.id === product.id)[0].price,
    }));

    const order = this.ordersRepository.create({
      customer,
      products: serializedProducts,
    });

    const orderedProductsQty = products.map(prod1 => ({
      id: prod1.id,
      quantity:
        productsExists.filter(p => p.id === prod1.id)[0].quantity -
        prod1.quantity,
    }));

    this.productsRepository.updateQuantity(orderedProductsQty);

    return order;
  }
}

export default CreateOrderService;
