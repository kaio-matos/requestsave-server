import { Request, Response } from "express";
import { prisma } from "../app";
import ErrorDealer from "../errors/ErrorDealer";
import { RequestBasicsType } from "../types/Request";
import { ResMsg } from "../utils/ResponseMessage";
import { RequestValidation } from "../validations/RequestValidate";

class RequestController {
  public async create(req: Request, res: Response): Promise<Response> {
    const data: RequestBasicsType = req.body;

    if (RequestValidation.create(data).error) throw new ErrorDealer("Validation:Error");

    const account = await prisma.account.findUnique({
      where: { id: data.account_id },
      include: {
        requests: { where: { title: data.title } },
        clients: { where: { id: data.client_id } },
        products: { where: { id: data.product_id } },
      },
    });

    if (!account) throw new ErrorDealer("User:DontExist");
    if (account.requests?.length) throw new ErrorDealer("Request:Exist");
    if (!account.clients?.length) throw new ErrorDealer("Client:DontExist");
    if (!account.products?.length) throw new ErrorDealer("Product:DontExist");

    const REQUEST = await prisma.request.create({ data: data });
    return res.status(201).json(ResMsg("Pedido criado com sucesso", REQUEST));
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    const newData = req.body;

    if (!newData) throw new ErrorDealer("Validation:Error");
    if (RequestValidation.edit(newData).error) throw new ErrorDealer("Validation:Error");

    const account = await prisma.account.findUnique({
      where: { id: newData.account_id },
      include: {
        requests: { where: { title: newData.title } },
        clients: { where: { id: newData.client_id } },
        products: { where: { id: newData.product_id } },
      },
    });
    if (!account) throw new ErrorDealer("User:DontExist");
    if (account.requests?.length) throw new ErrorDealer("Request:Exist");
    if (!account.clients?.length) throw new ErrorDealer("Client:DontExist");
    if (!account.products?.length) throw new ErrorDealer("Product:DontExist");

    const updated = await prisma.request.updateMany({
      where: {
        AND: [
          { id: newData.id },
          {
            account: {
              id: newData.account_id,
              clients: { some: { id: newData.client_id } },
              products: { some: { id: newData.product_id } },
            },
          },
        ],
      },
      data: newData,
    });

    if (updated.count === 0) throw new ErrorDealer("Request:SomeDocDontExist");

    return res.status(200).json(ResMsg("Pedido editado com sucesso!", true));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { account_id } = req.body;
    const id = parseInt(req.params.id);

    if (!id) throw new ErrorDealer("Validation:Error");
    if (RequestValidation.id(id).error) throw new ErrorDealer("Validation:Error");

    const deleted = await prisma.request.deleteMany({ where: { AND: [{ id }, { account_id }] } });
    if (deleted.count === 0) throw new ErrorDealer("Request:DontExist");

    return res.status(200).json(ResMsg("Pedido deletado com sucesso!", true));
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const account_id = req.body.account_id;
    const search = req.query.search;

    const pagination = {
      page: parseInt(String(req.query.page)),
      pageSize: parseInt(String(req.query.pageSize)),
    };

    let paginator = {};
    if (pagination.page && pagination.pageSize) {
      paginator = {
        skip: pagination.page * pagination.pageSize,
        take: pagination.pageSize + 1,
      };
    }

    const filter = {
      AND: [{ title: { contains: search ? String(search) : "" } }, { account_id }],
    };

    const REQUESTS = await prisma.request.findMany({
      where: filter,
      include: { client: true, product: true },
      ...paginator,
    });

    const quantity = await prisma.request.count({ where: filter });

    return res
      .status(200)
      .json(ResMsg("Pedidos encontrados com sucesso", { table: REQUESTS, quantity }));
  }
}
export default new RequestController();
