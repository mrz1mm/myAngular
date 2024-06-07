import { iUser } from './i-user';

export interface iAuthResponse {
  accessToken: string;
  success: boolean;
  user: iUser;
}
