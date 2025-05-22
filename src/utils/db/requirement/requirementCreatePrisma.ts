import { Tag } from "@prisma/client";
import prisma from "../prisma";
import slugfy from "../../slugfy";

interface RequiredFields {
  title: string;
  description: string;
  body: string;
  priority?: string;
  status?: string;
  deadline?: Date;
  projectId?: number;
  teamId?: number;
}

export default async function requirementCreatePrisma(
  info: RequiredFields,
  tagList: Tag[],
  authorUsername: string
) {
  const slug = slugfy(info.title);
  const requirement = await prisma.requirement.create({
    data: {
      ...info,
      slug,
      authorUsername,
      tagList: { connect: tagList },
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
