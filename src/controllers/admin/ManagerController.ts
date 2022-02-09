import { Request, Response } from "express";
import { prisma } from "../../app";
import { ResMsg } from "../../utils/ResponseMessage";

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
}

export default new ManagerController();
