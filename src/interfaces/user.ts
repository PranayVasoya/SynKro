export interface UserLookup {
  _id: string;
  username: string;
}

export interface ProfileFormData {
  username: string;
  prn: string;
  batch: string;
  mobile: string;
  github: string;
  linkedin: string;
  skills: string[];
}

export interface UserData {
  _id: string;
  username: string;
  email: string;
  prn?: string;
  batch?: string;
  mobile?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  profileComplete?: boolean;
  role:string;
  points: number;
}
