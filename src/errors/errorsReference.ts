import { ErrorReferenceType } from "../types/Error";

export const errorsReference: ErrorReferenceType[] = [
  {
    code: "Validation:Error",
    message: "Algum dado está incorreto, por favor tente novamente",
    status: 400,
  },

  {
    code: "PhoneNumber:DontExist",
    message: "O número descrito não existe",
    status: 404,
  },

  {
    code: "Server:Error",
    message: "Erro interno do servidor",
    status: 500,
  },

  {
    code: "User:Exist",
    message: "Já existe um usuário com este email",
    status: 409,
  },
  {
    code: "User:DontExist",
    message: "Conta não encontrada",
    status: 404,
  },
  {
    code: "User:AuthenticationFailed",
    message: "Seu email ou senha estão errados",
    status: 401,
  },
  {
    code: "User:Unauthorized",
    message: "Por favor faça o login para ter acesso",
    status: 401,
  },
  {
    code: "User:TokenBadFormatted",
    message: "O token para autorização está mal formatado",
    status: 400,
  },
  {
    code: "User:TokenInvalid",
    message: "O token para autorização é inválido",
    status: 400,
  },

  {
    code: "User:EmailConfirmed",
    message: "Este email já foi confirmado",
    status: 400,
  },
  {
    code: "User:EmailNotConfirmed",
    message: "Por favor confirme seu email",
    status: 400,
  },
  {
    code: "User:EmailInvalidToken",
    message: "Token inválido",
    status: 400,
  },
  {
    code: "User:EmailExpiredToken",
    message: "Seu token expirou, tente novamente",
    status: 400,
  },
];
