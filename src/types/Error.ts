export type ErrorReferenceType = {
  code: string;
  message: string;
  status: number;
};

export type UnionCodesType =
  | "P1008"
  | "P1017"
  | "P2025"
  | "Validation:Error"
  | "User:Exist"
  | "User:DontExist"
  | "User:AuthenticationFailed"
  | "User:Unauthorized"
  | "User:TokenBadFormatted"
  | "User:TokenInvalid"
  | "User:TokenExpired"
  | "User:EmailConfirmed"
  | "User:EmailNotConfirmed"
  | "User:EmailInvalidToken"
  | "User:EmailExpiredToken"
  | "Email:SendFailed"
  | "Server:Error"
  | "PhoneNumber:DontExist";
