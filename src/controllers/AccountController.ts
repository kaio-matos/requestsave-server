import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../app";

import { AccountValidation } from "../validations/AccountValidate";

import { generateTokenAndExpiration } from "../utils/generateTokenAndExpiration";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail";
import { ResMsg } from "../utils/ResponseMessage";

import ErrorDealer from "../errors/ErrorDealer";

import { AccountRegistrationI } from "../types/Account";
import { createJWT } from "../utils/createJwt";
import { sendMail } from "../modules/mailer";

class AccountController {
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password }: { email: string; password: string } = req.body;

    if (AccountValidation.login({ email, password }).error) {
      throw new ErrorDealer("Validation:Error", "Por favor descreva o email e a senha");
    }

    const account = await prisma.account.findUnique({ where: { email } });

    if (!account) throw new ErrorDealer("User:DontExist", "Seu email ou senha estão errados");
    if (!account.confirmedEmail) throw new ErrorDealer("User:EmailNotConfirmed");

    const isCorrect = bcrypt.compareSync(password, account.password);
    if (!isCorrect) throw new ErrorDealer("User:AuthenticationFailed");

    const accountInfo = {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      role: account.role,
    };

    const TOKEN = createJWT(account.id);

    res.cookie("token", TOKEN, {
      // expires: new Date(Date.now() + 1000 * 60 * 60)
      // sameSite: 'none'
      // secure: true
    });
    res.cookie("role", account.role, {
      // expires: new Date(Date.now() + 1000 * 60 * 60)
      // sameSite: 'none'
      // secure: true
    });
    return res.status(200).json(ResMsg("Login realizado com sucesso!", { ...accountInfo }));
  }

  public Register = {
    async sendEmail(req: Request, res: Response): Promise<Response> {
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
    },
    async resendEmail(req: Request, res: Response): Promise<Response> {
      const email: string = req.body.email;

      if (AccountValidation.email(email).error) throw new ErrorDealer("Validation:Error");

      const { token, expiration } = generateTokenAndExpiration(24, 20);
      const account = await prisma.account.findUnique({ where: { email } });

      if (!account) throw new ErrorDealer("User:DontExist");
      if (account.confirmedEmail) throw new ErrorDealer("User:EmailConfirmed");

      await prisma.account.update({
        where: { email },
        data: { confirmedEmailExpires: expiration, confirmedEmailToken: token },
      });
      const message = await sendConfirmationEmail(token, email);
      if (!message) throw new ErrorDealer("Email:SendFailed");

      return res.status(200).json(ResMsg("Email enviado com sucesso", true));
    },
    async confirmEmail(req: Request, res: Response): Promise<Response> {
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
    },
  };

  public Auth = {
    async logout(req: Request, res: Response): Promise<Response> {
      const account_id = req.body.account_id;
      if (!account_id) throw new ErrorDealer("User:TokenInvalid");

      return res.status(200).json(ResMsg("Usuário deslogado com sucesso", true));
    },

    async edit(req: Request, res: Response): Promise<Response> {
      const { account_id, ...newData } = req.body;
      if (!newData) throw new ErrorDealer("Validation:Error");

      if (AccountValidation.edit(newData).error) throw new ErrorDealer("Validation:Error");

      const account = await prisma.account.findUnique({ where: { id: account_id } });
      if (!account) throw new ErrorDealer("User:DontExist");

      await prisma.account.update({ where: { id: account_id }, data: newData });

      return res.status(200).json(ResMsg("Conta editada com sucesso!", true));
    },

    async resetPassword(req: Request, res: Response): Promise<Response> {
      const { account_id, password } = req.body;

      if (AccountValidation.password(password).error) {
        throw new ErrorDealer(
          "Validation:Error",
          "Por favor use uma senha com pelo menos seis dígitos"
        );
      }

      const account = await prisma.account.findUnique({ where: { id: account_id } });
      if (!account) throw new ErrorDealer("User:DontExist");

      await prisma.account.update({ where: { id: account_id }, data: { password } });

      return res.status(200).json(ResMsg("Senha editada com sucesso!", true));
    },

    async delete(req: Request, res: Response): Promise<Response> {
      const account_id = req.body.account_id;

      const del = await prisma.account.delete({ where: { id: account_id } });
      // Missing | Delete phoneNumber linked with this account
      if (!del) throw new ErrorDealer("User:DontExist");

      return res.status(200).json(ResMsg("Conta deletada com sucesso!", true));
    },

    async checkJWT(req: Request, res: Response): Promise<Response> {
      const account_id = req.body.account_id;

      if (!account_id) throw new ErrorDealer("User:Unauthorized", "JWT não foi identificado");
      return res.status(200).json(ResMsg("JWT identificado com sucesso", true));
    },
  };

  public ForgetPassword = {
    async sendEmail(req: Request, res: Response): Promise<Response> {
      const { email }: { email: string } = req.body;

      if (AccountValidation.email(email).error) {
        throw new ErrorDealer("Validation:Error", "Por favor escreva o email corretamente");
      }

      const account = await prisma.account.findUnique({ where: { email } });
      if (!account) throw new ErrorDealer("User:DontExist");

      const { token, expiration } = generateTokenAndExpiration(1, 7);

      const mail = await sendMail(email, { token }, "auth/forgot_password", {
        subject: "Esqueceu a senha? Utilize este link para recuperá-la",
        text: "Caso não tenha sido você que fez este pedido apenas ignore",
      });

      if (!mail) throw new ErrorDealer("Email:SendFailed");

      await prisma.account.update({
        where: { email },
        data: {
          passwordResetToken: token,
          passwordResetExpires: expiration,
        },
      });

      return res.status(200).json(ResMsg("Email enviado com sucesso", true));
    },

    async reset(req: Request, res: Response): Promise<Response> {
      const { email, token, password }: { email: string; token: string; password: string } =
        req.body;
      const now = new Date();
      if (AccountValidation.forgotResetPass({ email, token, password }).error) {
        throw new ErrorDealer(
          "Validation:Error",
          "Por favor escreva corretamente email, senha e o código"
        );
      }

      const account = await prisma.account.findUnique({ where: { email } });

      if (!account) throw new ErrorDealer("User:DontExist");
      if (!account.confirmedEmail) throw new ErrorDealer("User:EmailNotConfirmed");
      if (token !== account.passwordResetToken) throw new ErrorDealer("User:TokenInvalid");
      if (account.passwordResetExpires && now > account.passwordResetExpires)
        throw new ErrorDealer("User:TokenExpired");

      await prisma.account.update({
        where: { email },
        data: { password, passwordResetExpires: now },
      });

      return res.status(200).json(ResMsg("Senha editada com sucesso!", true));
    },
  };
}

export default new AccountController();
