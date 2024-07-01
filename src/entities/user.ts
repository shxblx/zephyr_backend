interface User {
  userName: string;
  displayName: string;
  email: string;
  password: string;
  wallet?:Number
  isBlocked?: boolean;
  isVerified?: boolean;
  isAdmin?: boolean;
}

export default User;
