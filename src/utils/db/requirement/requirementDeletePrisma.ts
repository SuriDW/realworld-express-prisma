import prisma from "../prisma";

export default async function requirementDeletePrisma(slug: string) {
  const requirement = await prisma.requirement.delete({
    where: { slug },
  });
  return requirement;
}
