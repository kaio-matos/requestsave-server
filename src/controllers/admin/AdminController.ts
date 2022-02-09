// import PhoneNumberController from "./PhoneNumberController";
import ManagerController from "./ManagerController";

class AdminController {
  // createPhoneNumber = PhoneNumberController.create;
  // editPhoneNumber = PhoneNumberController.edit;
  // deletePhoneNumber = PhoneNumberController.delete;
  // getPhoneNumber = PhoneNumberController.get;

  editAccountRole = ManagerController.editRole;
  // deleteAccount = AccountControllerADM.delete;
  getAccounts = ManagerController.get;
}

export default new AdminController();
