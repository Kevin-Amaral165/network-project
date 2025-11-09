export interface User {
  id: number;
  username: string;
  password?: string; // Optional because we don't want to send it back to the client
  role: 'admin' | 'customer';
}
