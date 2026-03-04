export interface LoginResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;

  accessToken: string;
  refreshToken: string;
}
