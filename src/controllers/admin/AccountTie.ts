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
    if (accountTie) throw new ErrorDealer("AccountTie:Exist");

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
    let name = req.query.name;

    const ACCOUNTTIES = await prisma.accountTie.findMany({
      where: { phoneNumber: { contains: name ? String(name) : "" } },
      include: { account: true },
    });

    return res.status(200).json(ResMsg("Vínculos encontrados com sucesso", ACCOUNTTIES));
  }
}
export default new AccountTie();
