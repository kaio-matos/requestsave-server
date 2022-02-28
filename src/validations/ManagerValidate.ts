import Joi, { ValidationResult } from "joi";

class ManagerValidationClass {
  ACCOUNT_ROLES = ["USER", "ADMIN"];

  edit = (data: { id: number; role: "USER" | "ADMIN" }): ValidationResult => {
    const schema = Joi.object({
      id: Joi.number().positive().required(),
      accountTie_id: Joi.number().positive().required(),
      role: Joi.string()
        .valid(...this.ACCOUNT_ROLES)
        .required(),
    });

    return schema.validate(data);
  };

  id = (id: number): ValidationResult => {
    const schema = Joi.number().positive().required();
    return schema.validate(id);
  };
}

const ManagerValidation = new ManagerValidationClass();

export { ManagerValidation };
