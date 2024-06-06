export interface iUser {
  id: number;
  role: string;
  name: string;
  surname: string;
  gender?: string;
  dateBirth: Date | undefined;
  biography?: string;
  userImage?: string;
  username: string;
  email: string;
  password: string;
}
