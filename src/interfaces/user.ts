export interface FormData {
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
  prn: string;
  batch: string;
  email: string;
  mobile: string;
  github: string;
  linkedin: string;
  skills: string[];
}

export interface UserLookup {
  _id: string;
  username: string;
}
