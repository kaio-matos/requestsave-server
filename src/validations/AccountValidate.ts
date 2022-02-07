import Joi, { ValidationResult } from "joi";
import {
  AccountForgetPass,
  AccountLogin,
  AccountRegistration,
} from "../types/Account";

class AccountValidationClass {
  min = {
    password: 6,
    string: 3,
  };

  max = {
    password: 200,
    email: 100,
    name: 50,
  };

  registration = (data: AccountRegistration): ValidationResult => {
    const schema = Joi.object({
      firstName: Joi.string()
        .min(this.min.string)
        .max(this.max.name)
        .required(),
      lastName: Joi.string().min(this.min.string).max(this.max.name).required(),
      email: Joi.string()
        .email()
        .min(this.min.string)
        .max(this.max.email)
        .required(),
      phoneNumber: Joi.string().max(15).required(),
      password: Joi.string()
        .min(this.min.password)
        .max(this.max.password)
        .required(),
    });

    return schema.validate(data);
  };

  login = (data: AccountLogin): ValidationResult => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .min(this.min.string)
        .max(this.max.email)
        .required(),
      password: Joi.string()
        .min(this.min.password)
        .max(this.max.password)
        .required(),
    });

    return schema.validate(data);
  };

  forgotResetPass = (data: AccountForgetPass): ValidationResult => {
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .min(this.min.string)
        .max(this.max.email)
        .required(),
      token: Joi.string().length(7).required(),
      password: Joi.string()
        .min(this.min.password)
        .max(this.max.password)
        .required(),
    });

    return schema.validate(data);
  };

  edit = <Changes>(data: Changes): ValidationResult => {
    const schema = Joi.object({
      firstName: Joi.string().min(this.min.string).max(this.max.name),
      lastName: Joi.string().min(this.min.string).max(this.max.name),
      email: Joi.string().email().min(this.min.string).max(this.max.email),
      phoneNumber: Joi.number(),
      password: Joi.string().min(this.min.password).max(this.max.password),
    });

    return schema.validate(data);
  };
}

const AccountValidation = new AccountValidationClass();

export { AccountValidation };
