import { User } from "@prisma/client";
import { Link } from "../utils/types";
import profileViewer from "./profileViewer";

export default function linkViewer(
  link: Link,
  currentUser?: User
) {
  const linkView = {
    title: link.title,
    overview: link.overview,
    url: link.url,
    type: link.type,
    createdAt: link.createdAt || new Date(),
    author: link.author ? profileViewer(link.author, currentUser) : null,
  };
  return linkView;
}
