import { ErrorReferenceType } from "../types/Error";

export const prismaErrorsReference: ErrorReferenceType[] = [
  {
    code: "P1008",
    message: "O tempo de operação expirou, por favor tente novamente",
    status: 408,
  },

  {
    code: "P1017",
    message: "O servidor fechou a conexão com o banco de dados",
    status: 408,
  },
  {
    code: "P2025",
    message: "Dado não encontrado",
    status: 404,
  },
];
