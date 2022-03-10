import { Router } from "express";

import AccountController from "../controllers/AccountController";
import auth from "../middlewares/auth";

const routes = Router();

routes.post("/register", AccountController.Register.sendEmail);
routes.post("/resendregisterconfirmation", AccountController.Register.resendEmail);
routes.get("/confirmregistration", AccountController.Register.confirmEmail);

routes.post("/login", AccountController.login);
routes.post("/forgetpassword", AccountController.ForgetPassword.sendEmail);
routes.post("/forgetresetpassword", AccountController.ForgetPassword.reset);

routes.post("/resetpassword", auth, AccountController.Auth.resetPassword);
routes.post("/checktoken", auth, AccountController.Auth.checkJWT);
routes.post("/logout", auth, AccountController.Auth.logout);
routes.put("/", auth, AccountController.Auth.edit);
routes.delete("/", auth, AccountController.Auth.delete);

export default routes;
