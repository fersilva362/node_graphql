import { createSchema } from "graphql-yoga";
import {
  userTypeDef as User,
  resolvers as userResolver,
} from "./models/user.js";
import {
  commentTypeDef as Comment,
  resolvers as commentResolver,
} from "./models/comments.js";
import _ from "lodash";
const queries = `
    type Query {
      hello: String
      
    }
   
  `;

const resolvers = {
  Query: {
    hello: () => "hola fer  ",
    //user: () => ({ id: 1, name: "mael " }),
  },
};

export const schema = createSchema({
  typeDefs: [queries, User, Comment],
  resolvers: _.merge(resolvers, userResolver, commentResolver),
});
