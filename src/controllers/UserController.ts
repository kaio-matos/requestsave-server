import ClientController from "./ClientController";

export class UserController {
  createClient = ClientController.create;
  editClient = ClientController.edit;
  deleteClient = ClientController.delete;
  getClients = ClientController.get;
}

export default new UserController();
