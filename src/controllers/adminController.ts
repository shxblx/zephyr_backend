import AdminUsecase from "../usecase/adminUsecase";

class AdminController {
  private adminUsecase: AdminUsecase;

  constructor(adminUsecase: AdminUsecase) {
    this.adminUsecase = adminUsecase;
  }
}

export default AdminController;
