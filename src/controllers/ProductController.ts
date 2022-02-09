import { Request, Response } from "express";
import { prisma } from "../app";
import ErrorDealer from "../errors/ErrorDealer";
import { ProductBasicsType } from "../types/Product";
import { ResMsg } from "../utils/ResponseMessage";
import { ProductValidation } from "../validations/ProductValidate";

class ProductController {
  public async create(req: Request, res: Response): Promise<Response> {
    const data: ProductBasicsType = req.body;

    if (ProductValidation.create(data).error) throw new ErrorDealer("Validation:Error");

    const products = (
      await prisma.account.findUnique({
        where: { id: data.account_id },
        include: { products: { where: { name: { equals: data.name } } } },
      })
    )?.products;
    if (products?.length) throw new ErrorDealer("Product:Exist");

    const PRODUCT = await prisma.product.create({ data: data });
    return res.status(201).json(ResMsg("Produto criado com sucesso", PRODUCT));
  }
}
export default new ProductController();
