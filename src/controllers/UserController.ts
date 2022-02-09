import ClientController from "./ClientController";
import ProductController from "./ProductController";
import RequestController from "./RequestController";

export class UserController {
  createClient = ClientController.create;
  editClient = ClientController.edit;
  deleteClient = ClientController.delete;
  getClients = ClientController.get;

  createProduct = ProductController.create;
  editProduct = ProductController.edit;
  deleteProduct = ProductController.delete;
  getProducts = ProductController.get;

  createRequest = RequestController.create;
  editRequest = RequestController.edit;
}

export default new UserController();
