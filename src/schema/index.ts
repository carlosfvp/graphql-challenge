import { PostsQuery } from "./query";
import { PostMutation } from "./mutation";
export * from "./types";
export * from "./mutation";

export const resolvers = {
  ...PostsQuery,
  ...PostMutation,
};
