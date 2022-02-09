import ClientController from "./ClientController";
import ProductController from "./ProductController";

export class UserController {
  createClient = ClientController.create;
  editClient = ClientController.edit;
  deleteClient = ClientController.delete;
  getClients = ClientController.get;

  createProduct = ProductController.create;
  editProduct = ProductController.edit;
}

export default new UserController();
