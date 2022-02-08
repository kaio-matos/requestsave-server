import { Response, Request } from "express";
import { prisma } from "../app";
import ErrorDealer from "../errors/ErrorDealer";
import { ClientBasicsType } from "../types/Client";
import { ResMsg } from "../utils/ResponseMessage";
import { ClientValidation } from "../validations/ClientValidate";

class ClientController {
  public async create(req: Request, res: Response): Promise<Response> {
    const data: ClientBasicsType = req.body;

    if (ClientValidation.create(data).error) throw new ErrorDealer("Validation:Error");

    const clients = (
      await prisma.account.findUnique({
        where: { id: data.account_id },
        include: { clients: { where: { name: { equals: data.name } } } },
      })
    )?.clients;

    if (clients?.length) throw new ErrorDealer("Client:Exist");

    const CLIENT = await prisma.client.create({ data: data });
    return res.status(200).json(ResMsg("Cliente criado com sucesso", CLIENT));
  }
}
export default new ClientController();
