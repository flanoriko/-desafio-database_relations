import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.body;
      const findOrderService = container.resolve(FindOrderService);
      const order = await findOrderService.execute({ id });
      return response.json(order);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { customer_id, products } = request.body;
      const createOrderService = container.resolve(CreateOrderService);
      const orderCreated = await createOrderService.execute({
        customer_id,
        products,
      });

      return response.json(orderCreated);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
