interface User {
  _id?: string;
  userName: string;
  displayName: string;
  email: string;
  password: string;
  wallet?: number;
  status?: string;
  profilePicture?: string;
  isPremium?: boolean;
  isBlocked?: boolean;
  isAdmin?: boolean;
  joined_date?: Date;
}

export default User;
