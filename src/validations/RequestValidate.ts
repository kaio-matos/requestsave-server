import Joi, { ValidationResult } from "joi";
import { RequestBasicsType } from "../types/Request";

class RequestValidationClass {
  STATUS_ARRAY = ["TODO", "GRAPHIC", "DEALING", "CANCELLED", "COMPLETED"];

  create = (data: RequestBasicsType): ValidationResult => {
    const schema = Joi.object({
      account_id: Joi.number().positive().required(),
      product_id: Joi.number().positive().required(),
      client_id: Joi.number().positive().required(),

      title: Joi.string().min(3).max(50).required(),
      status: Joi.string().valid(...this.STATUS_ARRAY),
      price: Joi.number().min(0).required(),
      paidOut: Joi.number().min(0),
      balance: Joi.number().min(0),
      expiresIn: Joi.date().required(),
    });

    return schema.validate(data);
  };

  edit = (data: unknown): ValidationResult => {
    const schema = Joi.object({
      account_id: Joi.number().positive().required(),
      id: Joi.number().positive(),
      product_id: Joi.number().positive(),
      client_id: Joi.number().positive(),

      title: Joi.string().min(3).max(50),
      status: Joi.string().valid(...this.STATUS_ARRAY),

      price: Joi.number().min(0),
      paidOut: Joi.number().min(0),
      balance: Joi.number().min(0),
      expiresIn: Joi.date(),
    });

    return schema.validate(data);
  };

  id = (id: string): ValidationResult => {
    const schema = Joi.number().positive().required();
    return schema.validate(id);
  };
}

const RequestValidation = new RequestValidationClass();

export { RequestValidation };
