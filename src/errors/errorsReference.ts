import { ErrorReferenceType } from "../types/Error";

export const errorsReference: ErrorReferenceType[] = [
  {
    code: "Validation:Error",
    message: "Algum dado está incorreto, por favor tente novamente",
    status: 400,
  },
  {
    code: "User:Exist",
    message: "Já existe um usuário com este email",
    status: 409,
  },

  {
    code: "Server:Error",
    message: "Erro interno do servidor",
    status: 500,
  },
];
