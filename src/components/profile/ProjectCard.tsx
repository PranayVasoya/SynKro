import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";

// Interfaces
import type { Project } from "@/interfaces/project";
import type { UserLookup } from "@/interfaces/user";

interface ProjectCardProps {
  project: Project;
  availableUsers: UserLookup[];
  creatorUsername?: string;
}

const ProjectCard = ({
  project,
  availableUsers,
  creatorUsername
}: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-4 bg-card rounded-lg shadow-sm border border-border"
  >
    <h4 className="text-lg font-semibold text-foreground mb-2">
      {project.title}
    </h4>
    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
      {project.description}
    </p>
    {/* Tech Stack */}
    <div className="mb-3">
      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        Tech Stack
      </h5>
      <div className="flex flex-wrap gap-1.5">
        {project.techStack?.length > 0 ? (
          project.techStack.map((skill, index) => (
            <span
              key={index}
              className="inline-block bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Not specified
          </span>
        )}
      </div>
    </div>
    {/* Team Members */}
    <div className="mb-3">
      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        Team Members
      </h5>
      <div className="flex flex-wrap gap-1.5">
        {project.teamMembers?.length > 0 ? (
          project.teamMembers.map((memberId, index) => {
            const member = availableUsers.find((user) => user._id === memberId);
            return (
              <span
                key={index}
                className="inline-block bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {member ? member.username : "..."}
              </span>
            );
          })
        ) : creatorUsername ? (
          <span className="inline-block bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {creatorUsername} (Creator)
          </span>
        ) : (
          <span className="text-xs text-muted-foreground italic">Just you (or creator not specified)</span>
        )}
      </div>
    </div>

    {/* Links Section */}
    <div className="mb-3">
      {" "}
      <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
        Links
      </h5>{" "}
      <div className="flex items-center space-x-4">
        {" "}
        {project.repoLink ? (
          <a
            href={
              project.repoLink.startsWith("http")
                ? project.repoLink
                : `https://${project.repoLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            title="Repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 opacity-50"
            >
              <polyline points="10 8 4 12 10 16"></polyline>
              <polyline points="14 8 20 12 14 16"></polyline>
            </svg>
            <span className="text-xs">Repo</span>
          </a>
        ) : (
          <span className="text-xs text-muted-foreground italic flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 opacity-50"
            >
              <polyline points="10 8 4 12 10 16"></polyline>
              <polyline points="14 8 20 12 14 16"></polyline>
            </svg>{" "}
            No Repo
          </span>
        )}
        {project.liveLink ? (
          <a
            href={
              project.liveLink.startsWith("http")
                ? project.liveLink
                : `https://${project.liveLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            title="Live Demo"
          >
            <LinkIcon size={16} className="mr-1 flex-shrink-0" />
            <span className="text-xs">Live</span>
          </a>
        ) : (
          <span className="text-xs text-muted-foreground italic flex items-center">
            <LinkIcon size={16} className="mr-1 opacity-50" /> No Live Demo
          </span>
        )}
      </div>
    </div>

    {/* Status */}
    <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-2 flex justify-between items-center">
      <span>
        Status:{" "}
        <span
          className={`font-medium ${
            project.status === "active"
              ? "text-green-600 dark:text-green-400"
              : "text-gray-500"
          }`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </span>
      {project.lookingForMembers && (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          Recruiting
        </span>
      )}
    </div>
  </motion.div>
);

export default ProjectCard;
