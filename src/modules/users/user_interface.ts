export type TRole = 'admin' | 'manager' | 'employee';

export type TUser = {
  name: string;
  email: string;
  role: TRole;
  password: string;
};
