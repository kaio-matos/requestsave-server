import { UnionCodesType } from "../types/Error";
import { errorsReference } from "./errorsReference";
import { prismaErrorsReference } from "./prismaErrorsReference";

export const allErrorsReference = [...errorsReference, ...prismaErrorsReference];

class ErrorDealer {
  code: UnionCodesType;
  meta: {
    cause: string;
  };
  status: number;

  constructor(code: UnionCodesType, message?: string, status?: number) {
    this.code = code;
    this.meta = { cause: "" };
    this.status = 500;

    allErrorsReference.forEach((error) => {
      if (code !== error.code) return;
      this.meta = { cause: error.message };
      this.status = error.status;
    });

    if (message) this.meta = { cause: message };
    if (status) this.status = status;
  }
}

export default ErrorDealer;
