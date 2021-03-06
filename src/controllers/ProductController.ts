import { Request, Response } from "express";
import { prisma } from "../app";
import ErrorDealer from "../errors/ErrorDealer";
import { ProductBasicsType } from "../types/Product";
import { ResMsg } from "../utils/ResponseMessage";
import { ProductValidation } from "../validations/ProductValidate";

class ProductController {
  /** Cria um produto  */
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

  /** Altera um produto com seu ID */
  public async edit(req: Request, res: Response): Promise<Response> {
    const newData = req.body;
    const id = parseInt(req.params.id);

    if (!newData) throw new ErrorDealer("Validation:Error");
    if (ProductValidation.edit({ id, ...newData }).error) throw new ErrorDealer("Validation:Error");

    const products = (
      await prisma.account.findUnique({
        where: { id: newData.account_id },
        include: { products: { where: { id: { equals: newData.id } } } },
      })
    )?.products;
    if (!products?.length) throw new ErrorDealer("Product:DontExist");

    const updated = await prisma.product.updateMany({
      where: { AND: [{ id }, { account_id: newData.account_id }] },
      data: newData,
    });
    if (updated.count === 0) throw new ErrorDealer("Product:DontExist");

    return res.status(200).json(ResMsg("Produto editado com sucesso!", true));
  }

  /** Deleta um produto com seu ID */
  public async delete(req: Request, res: Response): Promise<Response> {
    const { account_id } = req.body;
    const id = parseInt(req.params.id);

    if (!id) throw new ErrorDealer("Validation:Error");
    if (ProductValidation.id(id).error) throw new ErrorDealer("Validation:Error");

    const deleted = await prisma.product.deleteMany({ where: { AND: [{ id }, { account_id }] } });
    if (deleted.count === 0) throw new ErrorDealer("Product:DontExist");

    return res.status(200).json(ResMsg("Produto deletado com sucesso!", true));
  }

  /** Recebe a pagina????o e a search, ent??o responde enviando um array com todos os produtos de forma paginada e filtrado pelo search */
  public async get(req: Request, res: Response): Promise<Response> {
    const account_id = req.body.account_id;
    const search = req.query.search;

    const pagination = {
      page: parseInt(String(req.query.page)),
      pageSize: parseInt(String(req.query.pageSize)),
    };

    let paginator = {};
    if (typeof pagination.page === "number" && pagination.pageSize) {
      paginator = {
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize,
      };
    }

    const filter = {
      AND: [{ name: { contains: search ? String(search) : "" } }, { account_id }],
    };

    const PRODUCTS = await prisma.product.findMany({
      where: filter,
      include: { requests: { select: { id: true, title: true } } },
      ...paginator,
    });

    const quantity = await prisma.product.count({ where: filter });

    return res
      .status(200)
      .json(ResMsg("Produtos encontrados com sucesso", { table: PRODUCTS, quantity }));
  }
}
export default new ProductController();
