export type ErrorReferenceType = {
  code: string;
  message: string;
  status: number;
};

type UnionCodesPrismaType = "P1008" | "P1017" | "P2025";

type UnionCodesValidationType = "Validation:Error";
type UnionCodesEmailType = "Email:SendFailed";
type UnionCodesServerType = "Server:Error";
type UnionCodesPhoneNumberType = "PhoneNumber:DontExist";

type UnionCodesUserType =
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
  | "User:Forbidden";

type UnionCodesClientType = "Client:Exist" | "Client:DontExist";
type UnionCodesProductType = "Product:Exist" | "Product:DontExist";
type UnionCodesRequestType = "Request:Exist" | "Request:DontExist" | "Request:SomeDocDontExist";
type UnionCodesAccountTieType = "AccountTie:Exist" | "AccountTie:DontExist";

export type UnionCodesType =
  | UnionCodesPrismaType
  | UnionCodesValidationType
  | UnionCodesEmailType
  | UnionCodesServerType
  | UnionCodesPhoneNumberType
  | UnionCodesUserType
  | UnionCodesClientType
  | UnionCodesProductType
  | UnionCodesRequestType
  | UnionCodesAccountTieType;
