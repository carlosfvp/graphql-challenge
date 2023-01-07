import {
  createQueryValidationRule,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";
import express, { request } from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Comment, Post } from "../src/models";
import { PossibleTypeExtensionsRule } from "graphql";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const appTypeDefs = `
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

type PostDto = {
  id: string;
  title: string;
  body: string;
  comments: CommentDto[];
};

type CommentDto = {
  id: string;
  name: string;
  email: string;
  body: string;
};

type PostInput = {
  title: string;
  body: string;
};

type CommentInput = {
  postId: string;
  name: string;
  email: string;
  body: string;
};

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, appTypeDefs],
});

const root = {
  posts: async (args: any) => {
    const page = (args.page > 0 ? args.page - 1 : 0) as number;
    const recordsPerPage = (args.recordsPerPage ?? 10) as number;

    let postsArr: PostDto[] = [];
    const posts = await Post.find()
      .limit(recordsPerPage)
      .skip(recordsPerPage * page)
      .exec();

    for (const i in posts) {
      const p = posts[i];
      const comments = await Comment.find({ $in: p.comments }).exec();

      postsArr.push({
        id: p._id.toString(),
        title: p.title,
        body: p.body,
        comments: comments.map((c) => {
          let comment: CommentDto = {
            id: c._id.toString(),
            name: c.name,
            email: c.email,
            body: c.body,
          };
          return comment;
        }),
      });
    }

    return postsArr;
  },
  newPost: async (input: PostInput) => {
    const post = new Post({
      title: input.title,
      body: input.body,
    });

    await post.save();

    return post;
  },
  newComment: async (args: any) => {
    const commentInput: CommentInput = args.comment;

    const comment = new Comment({
      name: commentInput.name,
      body: commentInput.body,
      email: commentInput.email,
      post: new mongoose.Types.ObjectId(commentInput.postId),
    });

    return await comment.save();
  },
};

app.use(
  "/graphql",
  graphqlHTTP(async (request, response, params) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    validationRules: [
      createQueryValidationRule({ variables: params?.variables }),
    ],
  }))
);

export { app };
