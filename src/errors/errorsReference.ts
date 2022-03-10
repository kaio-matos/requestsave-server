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
    message: "Já existe um usuário com este email ou utilizando o mesmo número",
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
    code: "User:Forbidden",
    message: "Acesso negado",
    status: 403,
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
    code: "User:TokenExpired",
    message: "O token expirou",
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

  {
    code: "Email:SendFailed",
    message: "O envio de email falhou, tente novamente",
    status: 500,
  },

  {
    code: "Client:Exist",
    message: "Este cliente já existe",
    status: 400,
  },
  {
    code: "Client:DontExist",
    message: "Este cliente não existe",
    status: 404,
  },

  {
    code: "Product:Exist",
    message: "Este produto já existe",
    status: 400,
  },
  {
    code: "Product:DontExist",
    message: "Este produto não existe",
    status: 404,
  },

  {
    code: "Request:Exist",
    message: "Este pedido já existe",
    status: 400,
  },
  {
    code: "Request:DontExist",
    message: "Este pedido não existe",
    status: 404,
  },
  {
    code: "Request:SomeDocDontExist",
    message: "Algum dos itens seguintes não existe: pedido ou cliente ou produto",
    status: 404,
  },

  {
    code: "AccountTie:Exist",
    message: "Este vínculo já existe",
    status: 400,
  },
  {
    code: "AccountTie:DontExist",
    message: "Este vínculo não existe",
    status: 404,
  },

  {
    code: "UserAccountTie:Used",
    message: "Este vínculo já está sendo usado com outra conta",
    status: 409,
  },

  {
    code: "TestAdminCheck:Unauthorized",
    message: "O usuário Admin não pode ser alterado, por motivos de teste.",
    status: 409,
  },
];
