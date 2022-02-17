import Joi, { ValidationResult } from "joi";
import joiPhoneNumber from "joi-phone-number";
import { AccountTieBasicsType } from "../types/AccountTie";

const JoiPhone = Joi.extend(joiPhoneNumber);

class AccountTieValidationClass {
  create = (data: AccountTieBasicsType): ValidationResult => {
    const schema = Joi.object({
      phoneNumber: JoiPhone.string()
        .phoneNumber({ defaultCountry: "BR", format: "national", strict: true })
        .required(),
    });

    return schema.validate(data);
  };

  edit = (data: unknown): ValidationResult => {
    const schema = Joi.object({
      id: Joi.number().positive().required(),
      phoneNumber: JoiPhone.string()
        .phoneNumber({ defaultCountry: "BR", format: "national", strict: true })
        .required(),

      createdAt: Joi.date(),
      updatedAt: Joi.date(),
    });
    return schema.validate(data);
  };

  id = (id: number): ValidationResult => {
    const schema = Joi.number().positive().required();
    return schema.validate(id);
  };
}

const AccountTieValidation = new AccountTieValidationClass();

export { AccountTieValidation };
