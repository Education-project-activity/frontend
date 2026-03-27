export interface UserInfoInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  followersCount: number | null | undefined;
  topPosition: number | null | undefined;
  avatarUrl: string;
}
