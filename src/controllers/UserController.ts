import ClientController from "./ClientController";

export class UserController {
  createClient = ClientController.create;
}

export default new UserController();
