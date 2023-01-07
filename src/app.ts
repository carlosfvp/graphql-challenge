import {
  createQueryValidationRule,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";
import express, { request } from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Comment, Post } from "../src/models";
import { PossibleTypeExtensionsRule } from "graphql";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const appTypeDefs = `
  type Query {
    posts: [Post]
  }

  type Mutation {
    newComment(comment:CommentInput) : Comment
  }

  input CommentInput {
    title: String! @constraint(minLength: 10)
  }

  type Post {
    title: String
    body: String
    comments: [Comment]
  }

  type Comment {
    name: String
    email: String
    body: String
  }
`;

type PostDto = {
  title?: string;
  body?: string;
  comments?: CommentDto[];
};

type CommentDto = {
  name?: string;
  email?: string;
  body?: string;
};

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, appTypeDefs],
});

const root = {
  posts: async () => {
    let postsArr: PostDto[] = [];
    const posts = await Post.find().exec();

    for (const i in posts) {
      const p = posts[i];
      const comments = await Comment.find({ $in: p.comments }).exec();
      postsArr.push({
        title: p.title,
        body: p.body,
        comments: comments.map((c) => {
          let comment: CommentDto = {
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
