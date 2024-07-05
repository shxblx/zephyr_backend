import Encrypt from "../../usecase/interfaces/user/Iencrypt";
import bcrypt from "bcrypt";

class EncryptOtp implements Encrypt {
  async encrypt(otp: number): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(otp.toString(), salt);
    return hash;
  }

  async compare(otp: number, hashedOtp: string): Promise<boolean> {
    return await bcrypt.compare(otp.toString(), hashedOtp);
  }
}

export default EncryptOtp;
