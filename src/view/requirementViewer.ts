import { Requirement, Tag, User, Project, Team } from "@prisma/client";
import profileViewer from "./profileViewer";

type FullRequirement = Requirement & {
  tagList: Tag[];
  author: User & { followedBy: User[] };
  project?: Project;
  team?: Team;
  _count: { favoritedBy: number };
};

export default function requirementViewer(
  requirement: FullRequirement,
  currentUser?: User & { favoriteRequirements: Requirement[] }
) {
  const favorited = currentUser
    ? currentUser.favoriteRequirements.some(
        (value) => value.slug === requirement.slug
      )
    : false;

  const tagListView = requirement.tagList.map((tag) => tag.tagName).sort();

  const authorView = profileViewer(requirement.author, currentUser);

  const requirementView = {
    slug: requirement.slug,
    title: requirement.title,
    description: requirement.description,
    body: requirement.body,
    priority: requirement.priority,
    status: requirement.status,
    deadline: requirement.deadline,
    project: requirement.project 
      ? { 
          id: requirement.project.id,
          name: requirement.project.name,
          description: requirement.project.description,
        } 
      : null,
    team: requirement.team 
      ? { 
          id: requirement.team.id,
          name: requirement.team.name,
          description: requirement.team.description,
        } 
      : null,
    tagList: tagListView,
    createdAt: requirement.createdAt,
    updatedAt: requirement.updatedAt,
    favorited: favorited,
    favoritesCount: requirement._count.favoritedBy,
    author: authorView,
  };
  return requirementView;
}
