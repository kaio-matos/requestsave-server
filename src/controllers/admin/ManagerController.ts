import { Request, Response } from "express";
import { prisma } from "../../app";
import ErrorDealer from "../../errors/ErrorDealer";
import { ResMsg } from "../../utils/ResponseMessage";
import { ManagerValidation } from "../../validations/ManagerValidate";

class ManagerController {
  public async get(req: Request, res: Response): Promise<Response> {
    const accounts = await prisma.account.findMany();
    const treatedAccounts = accounts.map((acc) => {
      const {
        password,
        accountTie_id,
        passwordResetExpires,
        passwordResetToken,
        confirmedEmailExpires,
        confirmedEmailToken,
        ...rest
      } = acc;

      return rest;
    });

    return res.json(ResMsg("Usuários encontrados com sucesso", treatedAccounts));
  }

  public async editRole(req: Request, res: Response): Promise<Response> {
    const { account_id, ...data } = req.body;

    if (ManagerValidation.editRole(data).error) throw new ErrorDealer("Validation:Error");

    const account = await prisma.account.findUnique({ where: { id: data.id } });
    if (!account) throw new ErrorDealer("User:DontExist");

    await prisma.account.update({
      where: { id: data.id },
      data: { role: data.role },
    });

    return res.status(200).json(ResMsg("Cargo alterado com sucesso!", true));
  }
}

export default new ManagerController();
