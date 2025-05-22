import { Team } from "@prisma/client";

type FullTeam = Team & {
  _count: { 
    members: number;
    requirements: number;
    projects: number;
  };
};

export default function teamViewer(team: FullTeam) {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    membersCount: team._count.members,
    requirementsCount: team._count.requirements,
    projectsCount: team._count.projects,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
  };
}
