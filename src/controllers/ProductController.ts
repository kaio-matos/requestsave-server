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

  public async edit(req: Request, res: Response): Promise<Response> {
    const { account_id, ...newData } = req.body;

    if (!newData) throw new ErrorDealer("Validation:Error");
    if (ProductValidation.edit(newData).error) throw new ErrorDealer("Validation:Error");

    const updated = await prisma.product.updateMany({
      where: { AND: [{ id: newData.id }, { account_id }] },
      data: newData,
    });
    if (updated.count === 0) throw new ErrorDealer("Product:DontExist");

    return res.status(200).json(ResMsg("Produto editado com sucesso!", true));
  }
}
export default new ProductController();
