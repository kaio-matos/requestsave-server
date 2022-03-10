import { Router } from "express";
import AdminController from "../controllers/admin/AdminController";

import UserController from "../controllers/UserController";
import auth from "../middlewares/auth";
import roleCheck from "../middlewares/roleCheck";

const routes = Router();

// Checamos o usuário, e então criamos os seus respectivos modelos para alteração no DB
routes.use(auth);

routes.post("/client", UserController.createClient);
routes.put("/client/:id", UserController.editClient);
routes.delete("/client/:id", UserController.deleteClient);
routes.get("/client", UserController.getClients);

routes.post("/request", UserController.createRequest);
routes.put("/request/:id", UserController.editRequest);
routes.delete("/request/:id", UserController.deleteRequest);
routes.get("/request", UserController.getRequests);

routes.post("/product", UserController.createProduct);
routes.put("/product/:id", UserController.editProduct);
routes.delete("/product/:id", UserController.deleteProduct);
routes.get("/product", UserController.getProducts);

routes.put("/user/:id", roleCheck, AdminController.editAccount);
routes.delete("/user/:id", roleCheck, AdminController.deleteAccount);
routes.get("/user", roleCheck, AdminController.getAccounts);

routes.post("/accounttie", roleCheck, AdminController.createAccountTie);
routes.put("/accounttie/:id", roleCheck, AdminController.editAccountTie);
routes.delete("/accounttie/:id", roleCheck, AdminController.deleteAccountTie);
routes.get("/accounttie", roleCheck, AdminController.getAccountTie);

export default routes;
