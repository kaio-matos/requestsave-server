import ClientController from "./ClientController";

export class UserController {
  createClient = ClientController.create;
  editClient = ClientController.edit;
  deleteClient = ClientController.delete;
}

export default new UserController();
