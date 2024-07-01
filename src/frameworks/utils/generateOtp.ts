import OTP from "../../usecase/interfaces/Iotp";

class GenerateOtp implements OTP {
  createOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }
}

export default GenerateOtp;
