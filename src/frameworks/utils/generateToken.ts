import jwt from "jsonwebtoken";
import JWT from "../../usecase/interfaces/jwt";

class JWTToken implements JWT {
  generateToken(userId: string | undefined, role: string): string {
    const SECRETKEY = process.env.JWT_SECRET_KEY;
    if (SECRETKEY) {
      const token = jwt.sign({ userId, role }, SECRETKEY, {
        expiresIn: "30d",
      });
      return token;
    }
    throw new Error("JWT key is not defined!");
  }
}

export default JWTToken;
