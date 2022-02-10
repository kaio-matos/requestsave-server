import AccountTie from "./AccountTie";
import ManagerController from "./ManagerController";

class AdminController {
  createAccountTie = AccountTie.create;
  editAccountTie = AccountTie.edit;
  deleteAccountTie = AccountTie.delete;
  getAccountTie = AccountTie.get;

  editAccountRole = ManagerController.editRole;
  deleteAccount = ManagerController.delete;
  getAccounts = ManagerController.get;
}

export default new AdminController();
