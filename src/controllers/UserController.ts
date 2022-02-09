import ClientController from "./ClientController";
import ProductController from "./ProductController";

export class UserController {
  createClient = ClientController.create;
  editClient = ClientController.edit;
  deleteClient = ClientController.delete;
  getClients = ClientController.get;

  createProduct = ProductController.create;
  editProduct = ProductController.edit;
  deleteProduct = ProductController.delete;
  getProducts = ProductController.get;
}

export default new UserController();
