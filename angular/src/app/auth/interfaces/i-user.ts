export interface iUser {
  id: string;
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
