import { Account } from "@prisma/client";

type AccountBasicsType = Omit<
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

interface AccountRegistrationI extends AccountBasicsType {
  phoneNumber: string;
}

type AccountLoginType = {
  email: string;
  password: string;
};

type AccountForgetPassType = {
  email: string;
  token: string;
  password: string;
};

export {
  AccountBasicsType,
  AccountRegistrationI,
  AccountLoginType,
  AccountForgetPassType,
};
