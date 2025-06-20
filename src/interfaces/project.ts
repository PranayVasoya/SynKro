import type { UserLookup } from "./user";

export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  createdBy: UserLookup | null;
  teamMembers: UserLookup[];
  lookingForMembers: boolean;
  status: "active" | "completed";
  likes: LikeData[];
  comments: CommentData[];
  createdAt?: string;
  updatedAt?: string;
}

// Represents a single like, could be just user ID or a more complex object if needed
// If your backend returns just user IDs for likes:
// export type LikeData = string;
// If your backend returns like objects with user details (less common for just likes):
export interface LikeData {
  _id: string; // ID of the like itself
  userId: string; // or UserLookup
  createdAt: string;
}

export interface CommentData {
  _id: string;
  text: string;
  userId: UserLookup | null;
  createdAt: string;
}

// This interface can be used specifically for the data structure
// when submitting a *new* project to the backend.
export interface ProjectSubmissionData {
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  teamMembersIDs?: string[];
  lookingForMembers: boolean;
  status: "active" | "completed";
}