import { Requirement, User } from "@prisma/client";
import profileViewer from "./profileViewer";

type FullRequirement = Requirement & {
  creator: User & { followedBy: User[] };
  assignee?: User | null;
};

export default function requirementViewer(
  requirement: FullRequirement,
  currentUser?: User | null
) {
  const creatorView = profileViewer(requirement.creator, currentUser);
  const assigneeView = requirement.assignee
    ? profileViewer(requirement.assignee, currentUser)
    : null;

  const requirementView = {
    id: requirement.id,
    title: requirement.title,
    description: requirement.description,
    content: requirement.content,
    status: requirement.status,
    createdAt: requirement.createdAt,
    updatedAt: requirement.updatedAt,
    creator: creatorView,
    assignee: assigneeView,
  };
  return requirementView;
}
