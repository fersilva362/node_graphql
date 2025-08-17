import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema/type-def.js";
import { resolvers } from "./schema/resolvers.js";
import { setupDataBase } from "./src/mongo/index.js";
import prisma from "./db/prisma.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    try {
      const mongo = await setupDataBase();

      return { mongo, prisma };
    } catch (error) {
      console.log("in try/cathc" + error);
      return {};
    }
  },
});

server
  .listen(4000, () => {
    console.log("Running a GraphQL API server at ");
  })
  .then(({ url }) => console.log(url));
