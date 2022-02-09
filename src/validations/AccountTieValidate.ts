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
      account_id: Joi.number().positive().required(),
      id: Joi.number().positive().required(),
      name: Joi.string().min(3).max(50),
      email: Joi.string().email().allow(""),
    });
    return schema.validate(data);
  };

  id = (id: string): ValidationResult => {
    const schema = Joi.number().positive().required();
    return schema.validate(id);
  };
}

const AccountTieValidation = new AccountTieValidationClass();

export { AccountTieValidation };
