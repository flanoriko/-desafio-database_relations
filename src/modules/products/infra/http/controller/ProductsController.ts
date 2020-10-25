import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdQuantityService from '@modules/products/services/UpdQuantityService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, price, quantity } = request.body;

      const createProductService = container.resolve(CreateProductService);
      const productCreated = await createProductService.execute({
        name,
        price,
        quantity,
      });

      return response.json(productCreated);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  public async patch(request: Request, response: Response): Promise<Response> {
    try {
      const { products } = request.body;

      const updQuantityService = container.resolve(UpdQuantityService);
      const productUpdated = await updQuantityService.execute(products);

      return response.json(productUpdated);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
