import express from "express";
import { createYoga } from "graphql-yoga";
import { ruruHTML } from "ruru/server";
import { schema } from "../backend_node_graphQl/src/graphql/index.js";
//import { setupDataBase } from "./src/mongo/index.js";
import prisma from "./db/prisma.js";
const yoga = createYoga({
  schema,
  context: async () => {
    try {
      // const mongo = await setupDataBase();
      console.log(prisma);

      return { prisma };
    } catch (error) {
      console.log("in try/cathc" + error);
      return {};
    }
  },
});

const app = express();

app.listen(4000, () => {
  console.log(
    "Running a GraphQL API server at este http://localhost:4000/graphql"
  );
});
app.all("/graphql", yoga);
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});
