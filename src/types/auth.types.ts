export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}
