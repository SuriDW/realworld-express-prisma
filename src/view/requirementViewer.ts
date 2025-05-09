import { User } from "@prisma/client";
import profileViewer from "./profileViewer";

type UserWithFollow = User & { followedBy: User[] };

export interface RequirementWithRelations {
  id: string;
  slug: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date | null;
  creatorUsername: string;
  assigneeUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: User & { followedBy: User[] };
  assignee: (User & { followedBy: User[] }) | null;
  versions: {
    id: number;
    versionNumber: number;
    description: string;
    priority: string;
    status: string;
    dueDate: Date | null;
    requirementId: string;
    createdAt: Date;
  }[];
}

export default function requirementViewer(
  requirement: RequirementWithRelations,
  currentUser?: User
) {
  const creator = requirement.creator
    ? profileViewer(requirement.creator, currentUser)
    : null;
  
  const assignee = requirement.assignee
    ? profileViewer(requirement.assignee, currentUser)
    : null;

  const latestVersion = requirement.versions.length > 0
    ? requirement.versions[0]
    : null;

  return {
    id: requirement.id,
    slug: requirement.slug,
    title: requirement.title,
    description: requirement.description,
    priority: requirement.priority,
    status: requirement.status,
    dueDate: requirement.dueDate,
    creator,
    assignee,
    createdAt: requirement.createdAt,
    updatedAt: requirement.updatedAt,
    versionCount: requirement.versions.length,
    latestVersion: latestVersion ? {
      versionNumber: latestVersion.versionNumber,
      createdAt: latestVersion.createdAt
    } : null
  };
}
