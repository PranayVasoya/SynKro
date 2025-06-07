export interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  createdBy: string;
  teamMembers: string[];
  lookingForMembers: boolean;
  status: "active" | "completed";
}
