import {
  createQueryValidationRule,
  constraintDirectiveTypeDefs,
} from "graphql-constraint-directive";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { appTypeDefs } from "./schema/types";
import { resolvers } from "./schema";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, appTypeDefs],
});

app.use(
  "/graphql",
  graphqlHTTP(async (request, response, params) => ({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    validationRules: [
      createQueryValidationRule({ variables: params?.variables }),
    ],
  }))
);

export { app };
