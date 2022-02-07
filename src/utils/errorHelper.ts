import ErrorDealer, { allErrorsReference } from "../errors/ErrorDealer";

export function errorHelper(error: any): ErrorDealer {
  console.error(error);
  let err = error as ErrorDealer;

  const unkownError = allErrorsReference.find((errorRef) => {
    if (err.code === errorRef.code) return err;
  });

  if (!err.code || !err.meta.cause || !unkownError) {
    err = new ErrorDealer("Server:Error");
  }

  return err;
}
