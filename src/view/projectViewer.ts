import { Project, Team } from "@prisma/client";

type FullProject = Project & {
  team?: Team;
  _count: { requirements: number };
};

export default function projectViewer(project: FullProject) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    team: project.team 
      ? {
          id: project.team.id,
          name: project.team.name,
          description: project.team.description,
        } 
      : null,
    requirementsCount: project._count.requirements,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
