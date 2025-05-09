import { User } from "@prisma/client";

export type UserWithFollow = User & { followedBy: User[] };
