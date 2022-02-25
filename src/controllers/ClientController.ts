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

    const clients = (
      await prisma.account.findUnique({
        where: { id: newData.account_id },
        include: { clients: { where: { id: { equals: newData.id } } } },
      })
    )?.clients;

    if (!clients?.length) throw new ErrorDealer("Client:DontExist");

    const updated = await prisma.client.updateMany({
      where: { AND: [{ id: newData.id }, { account_id: newData.account_id }] },
      data: newData,
    });
    if (updated.count === 0) throw new ErrorDealer("Client:DontExist");

    return res.status(200).json(ResMsg("Cliente editado com sucesso!", true));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { account_id } = req.body;
    const id = parseInt(req.params.id);

    if (!id) throw new ErrorDealer("Validation:Error");
    if (ClientValidation.id(id).error) throw new ErrorDealer("Validation:Error");

    const deleted = await prisma.client.deleteMany({ where: { AND: [{ id }, { account_id }] } });
    if (deleted.count === 0) throw new ErrorDealer("Client:DontExist");

    return res.status(200).json(ResMsg("Cliente deletado com sucesso!", true));
  }

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

    const CLIENTS = await prisma.client.findMany({
      where: filter,
      include: { requests: { select: { id: true, title: true } } },
      ...paginator,
    });

    const quantity = await prisma.client.count({ where: filter });

    return res
      .status(200)
      .json(ResMsg("Clientes encontrados com sucesso", { table: CLIENTS, quantity }));
  }
}
export default new ClientController();
