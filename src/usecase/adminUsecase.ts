import AdminRepository from "../repository/adminRepository";

class AdminUsecase {
  private AdminRepository: AdminRepository;

  constructor(AdminRepository: AdminRepository) {
    this.AdminRepository = AdminRepository;
  }

  async checkAdmin(email: string) {
    const adminData = await this.AdminRepository.findAdmin(email);

    if (!adminData || adminData.isAdmin === false) {
      return {
        status: 400,
        isAdmin:false
      };
    }
    return {
      status: 200,
      isAdmin: true,
    };
  }
}

export default AdminUsecase;
