import { ResponseDataType } from "../types/Response";

export const ResMsg = <Type>(message: string, data: Type): ResponseDataType => {
  return { message, data };
};
