import prisma from "../prisma";

interface UpdateFields {
  title?: string;
  description?: string;
  body?: string;
  priority?: string;
  status?: string;
  deadline?: Date;
  projectId?: number;
  teamId?: number;
}

export default async function requirementUpdatePrisma(
  slug: string,
  info: UpdateFields
) {
  const requirement = await prisma.requirement.update({
    where: { slug },
    data: {
      ...info,
    },
    include: {
      author: { include: { followedBy: true } },
      tagList: true,
      project: true,
      team: true,
      _count: { select: { favoritedBy: true } },
    },
  });
  return requirement;
}
