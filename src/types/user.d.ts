type role = 'STUDENT' | 'ADMIN';
export interface User {
  email: string;
  password: string;
  name: string;
  role: role;
}
