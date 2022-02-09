import Joi, { ValidationResult } from "joi";
import { ProductBasicsType } from "../types/Product";

class ProductValidationClass {
  create = (data: ProductBasicsType): ValidationResult => {
    const schema = Joi.object({
      account_id: Joi.number().positive().required(),
      name: Joi.string().min(3).max(50).required(),
      basePrice: Joi.number().strict().positive().required(),
    });

    return schema.validate(data);
  };

  edit = (data: unknown): ValidationResult => {
    const schema = Joi.object({
      account_id: Joi.number().positive().required(),
      pdName: Joi.string().min(3).max(50),
      basePrice: Joi.number().strict().positive(),
    });

    return schema.validate(data);
  };

  id = (id: string): ValidationResult => {
    const schema = Joi.number().positive().required();
    return schema.validate(id);
  };
}

const ProductValidation = new ProductValidationClass();

export { ProductValidation };
