export const ResMsg = <Type>(
  message: string,
  data: Type
): { message: string; data: Type } => {
  return { message, data };
};
