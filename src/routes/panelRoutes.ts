import { Router } from "express";
import AdminController from "../controllers/admin/AdminController";

import UserController from "../controllers/UserController";
import auth from "../middlewares/auth";
import roleCheck from "../middlewares/roleCheck";

const routes = Router();

// Checamos o usuário, e então criamos os seus respectivos modelos para alteração no DB
routes.use(auth);

routes.post("/client", UserController.createClient);
routes.put("/client", UserController.editClient);
routes.delete("/client", UserController.deleteClient);
routes.get("/client", UserController.getClients);

routes.post("/request", UserController.createRequest);
routes.put("/request", UserController.editRequest);
routes.delete("/request", UserController.deleteRequest);
routes.get("/request", UserController.getRequests);

routes.post("/product", UserController.createProduct);
routes.put("/product", UserController.editProduct);
routes.delete("/product", UserController.deleteProduct);
routes.get("/product", UserController.getProducts);

routes.put("/users", roleCheck, AdminController.editAccountRole);
routes.delete("/users", roleCheck, AdminController.deleteAccount);
routes.get("/users", roleCheck, AdminController.getAccounts);

// routes.post("/phonenumber", roleCheck, AdminController.createPhoneNumber);
// routes.patch("/phonenumber", roleCheck, AdminController.editPhoneNumber);
// routes.delete("/phonenumber", roleCheck, AdminController.deletePhoneNumber);
// routes.get("/phonenumber", roleCheck, AdminController.getPhoneNumber);

export default routes;
