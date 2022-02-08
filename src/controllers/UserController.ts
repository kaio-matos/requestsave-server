import ClientController from "./ClientController";

export class UserController {
  createClient = ClientController.create;
  editClient = ClientController.edit;
}

export default new UserController();
