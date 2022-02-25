import { Request, Response } from "express";
import { prisma } from "../../app";
import ErrorDealer from "../../errors/ErrorDealer";
import { ResMsg } from "../../utils/ResponseMessage";
import { ManagerValidation } from "../../validations/ManagerValidate";

class ManagerController {
  public async get(req: Request, res: Response): Promise<Response> {
    const search = req.query.search;
    const [firstName, lastName] = String(search).split(" ");

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
      AND: [
        {
          firstName: { contains: firstName },
          lastName: { contains: lastName },
        },
      ],
    };

    const accounts = await prisma.account.findMany({
      where: filter,
      include: { accountTie: { select: { phoneNumber: true } } },
      ...paginator,
    });

    const quantity = await prisma.account.count({ where: filter });

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

    return res.json(
      ResMsg("Usuários encontrados com sucesso", { table: treatedAccounts, quantity })
    );
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

  public async delete(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    if (ManagerValidation.id(id).error) throw new ErrorDealer("Validation:Error");

    const account = await prisma.account.findUnique({ where: { id } });
    if (!account) throw new ErrorDealer("User:DontExist");

    const deleted = await prisma.account.delete({ where: { id } });
    await prisma.accountTie.delete({ where: { id: deleted.accountTie_id } });

    return res.status(200).json(ResMsg("Conta deletada com sucesso!", true));
  }
}

export default new ManagerController();
