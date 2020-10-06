import User, { IUser } from '../model/user.model';

class UserService {
  static async createUser(newUser: IUser) {
    return await User.create(newUser);
  }

  static async getUserById(id: string) {
    return await User.findById(id);
  }

  static async getUserForChannel(id: string) {
    return await User.findById(id).select('+password +salt');
  }

  static async getUserByUsername(username: string) {
    return await User.findOne({ username }).select('+password +salt');
  }
}

export default UserService;
