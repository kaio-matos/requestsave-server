import { Request, Response } from "express";
import { prisma } from "../app";

import { AccountValidation } from "../validations/AccountValidate";

import { generateTokenAndExpiration } from "../utils/generateTokenAndExpiration";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail";
import { ResMsg } from "../utils/ResponseMessage";
import { errorHelper } from "../utils/errorHelper";

import ErrorDealer from "../errors/ErrorDealer";

import { AccountRegistrationI } from "../types/Account";

class AccountController {
  public async registerAndSendEmail(req: Request, res: Response): Promise<Response> {
    const accountData: AccountRegistrationI = req.body;
    const { email, firstName, lastName, password, phoneNumber } = accountData;

    if (AccountValidation.registration(accountData).error) {
      throw new ErrorDealer("Validation:Error");
    }
    const accountTie = await prisma.accountTie.findUnique({
      where: { phoneNumber },
      include: { account: { select: { email: true } } },
    });

    if (!accountTie?.phoneNumber) throw new ErrorDealer("PhoneNumber:DontExist");
    if (accountTie?.account?.email) throw new ErrorDealer("User:Exist");

    const { token, expiration } = generateTokenAndExpiration(24, 20);

    const account = await prisma.account.create({
      data: {
        email,
        firstName,
        lastName,
        password,
        confirmedEmailExpires: expiration,
        confirmedEmailToken: token,
        accountTie: { connect: { phoneNumber } },
      },
    });

    await sendConfirmationEmail(token, account.email);

    return res.status(201).json(ResMsg("Email enviado com sucesso", true));
  }

  public async resendRegisterConfirmation(req: Request, res: Response): Promise<Response> {
    const email: string = req.body.email;

    if (!email) throw new ErrorDealer("Validation:Error");

    const { token, expiration } = generateTokenAndExpiration(24, 20);
    const account = await prisma.account.updateMany({
      where: { AND: [{ email: { equals: email } }, { confirmedEmail: { equals: false } }] },
      data: { confirmedEmailExpires: expiration, confirmedEmailToken: token },
    });

    if (account.count === 0) throw new ErrorDealer("User:EmailConfirmed");

    await sendConfirmationEmail(token, email);

    return res.status(200).json(ResMsg("Email enviado com sucesso", true));
  }

  public async confirmRegistration(req: Request, res: Response): Promise<Response> {
    const { token, email } = req.query;
    const now = new Date();

    if (!email || !token) {
      throw new ErrorDealer("Validation:Error", "Por favor escreva o email para a confirmação");
    }

    const account = await prisma.account.findUnique({ where: { email: email as string } });

    if (!account) throw new ErrorDealer("User:DontExist");
    if (account.confirmedEmail) throw new ErrorDealer("User:EmailConfirmed");
    if (token !== account.confirmedEmailToken) throw new ErrorDealer("User:EmailInvalidToken");
    if (account.confirmedEmailExpires && now > account.confirmedEmailExpires)
      throw new ErrorDealer("User:EmailExpiredToken");

    await prisma.account.update({
      where: {
        email: email as string,
      },
      data: {
        confirmedEmail: true,
      },
    });

    return res.status(200).json(ResMsg("Email confirmado com sucesso!", true));
  }
}

export default new AccountController();
