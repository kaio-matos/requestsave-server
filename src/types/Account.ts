import { Account } from "@prisma/client";

type AccountBasics = Omit<
  Account,
  | "id"
  | "confirmedEmail"
  | "confirmedEmailToken"
  | "confirmedEmailExpires"
  | "passwordResetToken"
  | "passwordResetExpires"
  | "createdAt"
  | "updatedAt"
  | "accountTie_id"
  | "role"
>;

interface AccountRegistration extends AccountBasics {
  phoneNumber: string;
}

type AccountLogin = {
  email: string;
  password: string;
};

type AccountForgetPass = {
  email: string;
  token: string;
  password: string;
};

export { AccountBasics, AccountRegistration, AccountLogin, AccountForgetPass };
