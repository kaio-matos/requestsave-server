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
    return res.status(201).json(ResMsg("Cliente criado com sucesso", CLIENT));
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    const newData = req.body;

    if (!newData) throw new ErrorDealer("Validation:Error");
    if (ClientValidation.edit(newData).error) throw new ErrorDealer("Validation:Error");

    const updated = await prisma.client.updateMany({
      where: { AND: [{ id: newData.id }, { account_id: newData.account_id }] },
      data: newData,
    });
    if (updated.count === 0) throw new ErrorDealer("Client:DontExist");

    return res.status(200).json(ResMsg("Cliente editado com sucesso!", true));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { account_id, id } = req.body;
    if (!id) throw new ErrorDealer("Validation:Error");
    if (ClientValidation.id(id).error) throw new ErrorDealer("Validation:Error");

    const deleted = await prisma.client.deleteMany({ where: { AND: [{ id }, { account_id }] } });
    if (deleted.count === 0) throw new ErrorDealer("Client:DontExist");

    return res.status(200).json(ResMsg("Cliente deletado com sucesso!", true));
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const account_id = req.body.account_id;
    let name = req.query.name;

    const CLIENTS = await prisma.client.findMany({
      where: {
        AND: [{ name: { contains: name ? String(name) : "" } }, { account_id }],
      },
    });

    if (!CLIENTS.length) throw new ErrorDealer("Client:DontExist", "Nenhum cliente foi encontrado");
    return res.status(200).json(ResMsg("Clientes encontrados com sucesso", CLIENTS));
  }
}
export default new ClientController();
