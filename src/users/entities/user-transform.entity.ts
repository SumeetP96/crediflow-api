export interface TransformedUser {
  id: number;
  username: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}
