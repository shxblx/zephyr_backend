import OTP from "../../usecase/interfaces/user/Iotp";

class GenerateOtp implements OTP {
  createOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

export default GenerateOtp;
