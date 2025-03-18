interface Link {
  title: string;
  overview: string;
  url: string;
  type: string;
  createdAt?: Date;
  author?: any;
}

export { ValidationError } from "./validationError";
export { Link };
