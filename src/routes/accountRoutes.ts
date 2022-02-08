import { Router } from "express";

import AccountController from "../controllers/AccountController";
import auth from "../middlewares/auth";

const routes = Router();

routes.post("/register", AccountController.registerAndSendEmail);
routes.post("/resendregisterconfirmation", AccountController.resendRegisterConfirmation);
routes.get("/confirmregistration", AccountController.confirmRegistration);

// routes.post("/login", AccountController.login);
// routes.post("/forgetpassword", AccountController.forgotSendEmail);
// routes.post("/forgetresetpassword", AccountController.forgotResetPass);

// routes.post("/resetpassword", auth, AccountController.resetPassword);
// routes.post("/checktoken", auth, AccountController.checkJWT);
// routes.post("/logout", auth, AccountController.logout);
// routes.patch("/edit", auth, AccountController.edit);
// routes.delete("/delete", auth, AccountController.delete);

export default routes;
