import { Request, Response } from "express";
import { prisma } from "../../app";
import ErrorDealer from "../../errors/ErrorDealer";
import { AccountTieBasicsType } from "../../types/AccountTie";
import { ResMsg } from "../../utils/ResponseMessage";
import { AccountTieValidation } from "../../validations/AccountTieValidate";

class AccountTie {
  public async create(req: Request, res: Response): Promise<Response> {
    const data: { account_id: string } & AccountTieBasicsType = req.body;

    if (AccountTieValidation.create({ phoneNumber: data.phoneNumber }).error)
      throw new ErrorDealer("Validation:Error");

    const accountTie = await prisma.accountTie.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });
    if (accountTie) throw new ErrorDealer("AccountTie:Exist");

    const tie = await prisma.accountTie.create({ data: { phoneNumber: data.phoneNumber } });
    return res.status(201).json(ResMsg("Vínculo criado com sucesso", tie));
  }
}
export default new AccountTie();
