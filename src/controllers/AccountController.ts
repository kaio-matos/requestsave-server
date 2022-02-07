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

    try {
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
    } catch (error) {
      const err = errorHelper(error);
      return res.status(err.status).json(err);
    }
  }
}

export default new AccountController();
