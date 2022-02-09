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
}
export default new RequestController();
