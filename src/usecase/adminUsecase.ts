import AdminRepository from "../repository/adminRepository";

class AdminUsecase {
  private AdminRepository: AdminRepository;

  constructor(AdminRepository: AdminRepository) {
    this.AdminRepository = AdminRepository;
  }
}

export default AdminUsecase;
