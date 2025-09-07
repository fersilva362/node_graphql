import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema/type-def.js";
import { resolvers } from "./schema/resolvers.js";
import { verifyToken } from "./src/graphql/middleware/authVerify.js";
import prisma from "./db/prisma.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || "";

    try {
      //const mongo = await setupDataBase();
      const userVerified = verifyToken(token);

      return { prisma, userVerified };
    } catch (error) {
      console.log("in try/cathc index.js" + error);
      return {};
    }
  },
});

server
  .listen(4000, () => {
    console.log("Running a GraphQL API server at ");
  })
  .then(({ url }) => console.log(url));
