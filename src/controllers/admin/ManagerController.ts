import { Request, Response } from "express";
import { prisma } from "../../app";
import ErrorDealer from "../../errors/ErrorDealer";
import { ResMsg } from "../../utils/ResponseMessage";
import { ManagerValidation } from "../../validations/ManagerValidate";

class ManagerController {
  /** Recebe a paginação e a search, então responde enviando um array com todos os usuários de forma paginada e filtrado pelo search */
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
      include: { accountTie: true },
      ...paginator,
    });

    const quantity = await prisma.account.count({ where: filter });

    const treatedAccounts = accounts.map((acc) => {
      const {
        password,
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

  /** Envia os dados para alterar o vínculo ou o cargo do usuário */
  public async edit(req: Request, res: Response): Promise<Response> {
    const { account_id, ...data } = req.body;
    const id = parseInt(req.params.id);

    if (ManagerValidation.edit({ id, ...data }).error) throw new ErrorDealer("Validation:Error");

    const account = await prisma.account.findUnique({ where: { id } });
    if (!account) throw new ErrorDealer("User:DontExist");

    const accountTie = await prisma.accountTie.findUnique({
      where: { id: data.accountTie_id },
      include: { account: true },
    });

    if (accountTie?.account && accountTie.account.id !== id)
      throw new ErrorDealer("UserAccountTie:Used");

    await prisma.account.update({
      where: { id },
      data: { role: data.role, accountTie_id: data.accountTie_id },
    });

    return res.status(200).json(ResMsg("Usuário alterado com sucesso!", true));
  }

  /** Deleta a conta de um usuário (e tudo que está associado a ele) baseado no ID enviado */
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
