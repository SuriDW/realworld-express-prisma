import { User } from "@prisma/client";
import prisma from "../prisma";

export default async function requirementFavoritePrisma(
  user: User,
  slug: string
) {
  const requirement = await prisma.requirement.update({
    where: { slug },
    data: { favoritedBy: { connect: { username: user.username } } },
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
