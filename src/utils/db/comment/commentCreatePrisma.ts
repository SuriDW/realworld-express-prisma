import { User } from "@prisma/client";
import prisma from "../prisma";

export default async function commentCreatePrisma(
  slug: string,
  content: string,
  author: User,
  isRequirement = false
) {
  const comment = await prisma.comment.create({
    data: { 
      body: content, 
      authorUsername: author.username, 
      articleSlug: isRequirement ? undefined : slug,
      requirementSlug: isRequirement ? slug : undefined
    },
    include: { author: { include: { followedBy: true } } },
  });
  return comment;
}
