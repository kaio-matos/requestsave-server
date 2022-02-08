import Joi, { ValidationResult } from "joi";
import { ClientBasicsType } from "../types/Client";

class ClientValidationClass {
  create = (data: ClientBasicsType): ValidationResult => {
    const schema = Joi.object({
      account_id: Joi.number().positive().required(),
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().allow(""),
    });

    return schema.validate(data);
  };

  edit = (data: unknown): ValidationResult => {
    const schema = Joi.object({
      account_id: Joi.number().positive().required(),
      name: Joi.string().min(3).max(50),
      email: Joi.string().email().allow(""),
    });
    return schema.validate(data);
  };
}

const ClientValidation = new ClientValidationClass();

export { ClientValidation };
