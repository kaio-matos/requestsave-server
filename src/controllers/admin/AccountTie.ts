import { Request, Response } from "express";
import { prisma } from "../../app";
import ErrorDealer from "../../errors/ErrorDealer";
import { AccountTieBasicsType } from "../../types/AccountTie";
import { ResMsg } from "../../utils/ResponseMessage";
import { AccountTieValidation } from "../../validations/AccountTieValidate";

class AccountTie {
  public async create(req: Request, res: Response): Promise<Response> {
    const data: { account_id: number } & AccountTieBasicsType = req.body;

    if (AccountTieValidation.create({ phoneNumber: data.phoneNumber }).error)
      throw new ErrorDealer("Validation:Error");

    const accountTie = await prisma.accountTie.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });
    if (accountTie) throw new ErrorDealer("AccountTie:Exist");

    const tie = await prisma.accountTie.create({ data: { phoneNumber: data.phoneNumber } });
    return res.status(201).json(ResMsg("Vínculo criado com sucesso", tie));
  }

  public async edit(req: Request, res: Response): Promise<Response> {
    const { id, account_id, ...newData } = req.body;

    if (!newData) throw new ErrorDealer("Validation:Error");
    if (AccountTieValidation.edit({ id, ...newData }).error)
      throw new ErrorDealer("Validation:Error");

    const accountTie = await prisma.accountTie.findUnique({
      where: { phoneNumber: newData.phoneNumber },
    });
    if (!accountTie) throw new ErrorDealer("AccountTie:DontExist");

    const updated = await prisma.accountTie.updateMany({
      where: { id: id },
      data: newData,
    });
    if (updated.count === 0) throw new ErrorDealer("AccountTie:DontExist");

    return res.status(200).json(ResMsg("Vínculo editado com sucesso!", true));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    if (!id) throw new ErrorDealer("Validation:Error");
    if (AccountTieValidation.id(id).error) throw new ErrorDealer("Validation:Error");

    const deleted = await prisma.accountTie.deleteMany({ where: { id } });
    if (deleted.count === 0) throw new ErrorDealer("AccountTie:DontExist");

    return res.status(200).json(ResMsg("Vínculo deletado com sucesso!", true));
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
      AND: [{ phoneNumber: { contains: search ? String(search) : "" } }],
    };

    const ACCOUNTTIES = await prisma.accountTie.findMany({
      where: filter,
      include: { account: { select: { email: true, firstName: true, lastName: true } } },
      ...paginator,
    });

    const quantity = await prisma.accountTie.count({ where: filter });

    return res
      .status(200)
      .json(ResMsg("Vínculos encontrados com sucesso", { table: ACCOUNTTIES, quantity }));
  }
}
export default new AccountTie();
