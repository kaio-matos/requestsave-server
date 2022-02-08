export type ErrorReferenceType = {
  code: string;
  message: string;
  status: number;
};

export type UnionCodesType =
  | "P1008"
  | "P1017"
  | "P2014"
  | "Validation:Error"
  | "User:Exist"
  | "User:DontExist"
  | "User:EmailConfirmed"
  | "User:EmailInvalidToken"
  | "User:EmailExpiredToken"
  | "Server:Error"
  | "PhoneNumber:DontExist";
