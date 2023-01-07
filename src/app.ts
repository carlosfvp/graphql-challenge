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

type Post = {
  title: string;
  body: string;
  comments: [Comment];
};

type Comment = {
  name: string;
  email: string;
  body: string;
};

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, appTypeDefs],
});

const root = {
  posts: async () => {
    const posts = await Post.find().exec();
    console.log(posts);

    return posts;
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
