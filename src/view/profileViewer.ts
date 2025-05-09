import { User } from "@prisma/client";
import { UserWithFollow } from "../utils/types/userTypes";

export default function profileViewer(
  user: UserWithFollow,
  currentUser?: User | null
) {
  const follows = currentUser
    ? Boolean(
        user.followedBy.find((value) => value.username == currentUser.username)
      )
    : false;
  const userView = {
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: follows,
  };
  return userView;
}
