import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export const EncryptPassword: Prisma.Middleware = async (params, next) => {
  if (params.model === "Account" && params.args?.data?.password) {
    let hash = "";

    switch (params.action) {
      case "create":
        hash = bcrypt.hashSync(params.args.data.password);
        params.args.data.password = hash;
        break;
      case "update":
        hash = bcrypt.hashSync(params.args.data.password);
        params.args.data.password = hash;
        break;
    }
  }

  const result = await next(params);
  return result;
};
