export const appTypeDefs = `
type Query {
  posts(page: Int, recordsPerPage: Int): [Post]
}

type Mutation {
  newPost(post:PostInput) : Post
  newComment(comment:CommentInput) : Comment
}

input PostInput {
  title: String! @constraint(minLength: 10)
  body: String!
}

input CommentInput {
  postId: String!
  name: String! @constraint(minLength: 10)
  email: String!
  body: String!
}

type Post {
  id: String!
  title: String
  body: String
  comments: [Comment]
}

type Comment {
  id: String!
  name: String!
  email: String!
  body: String!
  
}
`;

export type PostDto = {
  id: string;
  title: string;
  body: string;
  comments: CommentDto[];
};

export type CommentDto = {
  id: string;
  name: string;
  email: string;
  body: string;
};

export type PostInput = {
  title: string;
  body: string;
};

export type CommentInput = {
  postId: string;
  name: string;
  email: string;
  body: string;
};
