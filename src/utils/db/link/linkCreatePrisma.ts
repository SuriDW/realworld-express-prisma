import prisma from "../prisma";

export default async function linkCreatePrisma(
  linkData: {
    title: string;
    overview: string;
    url: string;
    type: string;
  },
  authorUsername: string
) {
  const link = await prisma.link.create({
    data: {
      title: linkData.title,
      overview: linkData.overview,
      url: linkData.url,
      type: linkData.type,
      author: {
        connect: {
          username: authorUsername,
        },
      },
    },
    include: {
      author: true,
    },
  });
  return link;
}
