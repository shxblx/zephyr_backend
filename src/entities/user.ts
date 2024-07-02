interface User {
  _id?: string;
  userName: string;
  displayName: string;
  email: string;
  password: string;
  wallet?: Number;
  isBlocked?: boolean;
  isAdmin?: boolean;
}

export default User;
