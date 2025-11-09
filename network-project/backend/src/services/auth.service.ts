import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

// In-memory user store
const users: User[] = [];

// Create a default admin user synchronously
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('adminpassword', salt);
users.push({
  id: 1,
  username: 'admin',
  password: hashedPassword,
  role: 'admin'
});

export const registerUser = async (user: User): Promise<Omit<User, 'password'>> => {
  if (users.find(u => u.username === user.username)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(user.password!, 10);
  const newUser: User = {
    id: users.length + 1,
    username: user.username,
    password: hashedPassword,
    role: user.role || 'customer'
  };

  users.push(newUser);
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUser = async (user: User): Promise<string> => {
  const foundUser = users.find(u => u.username === user.username);

  if (!foundUser) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(user.password!, foundUser.password!);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: foundUser.id, role: foundUser.role }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  return token;
};
