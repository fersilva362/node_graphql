import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { performance } from "perf_hooks";
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worlsecretkey";

export const resolvers = {
  Query: {
    user: async (obj, { id }, { mongo }) => {
      console.log(id);
      try {
        const user = await mongo.users.findOne({ _id: new ObjectId(id) });
        console.log(user);
        return user;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    users: async (obj, args, { prisma }) => {
      console.log(prisma);
      try {
        const users = await prisma.users.findMany();
        console.log(users);
        return users;
      } catch (error) {
        console.error("Prisma error:", error);
        throw new Error("Failed to fetch users: " + error.message);
      }
    },
  },
  User: {
    id: (obj) => obj._id,
  },
  Mutation: {
    createUser: async (_, { user }, { prisma }) => {
      try {
        const handlePassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        /*  username: String!
    email: String!
    password: String! */
        const result = await prisma.users.create({
          data: {
            username: user.username,
            email: user.email,
            password: handlePassword,
          },
        });
        const safeResult = {
          ...result,
          password: undefined,
          id: result.id.toString(),
        };
        console.log(safeResult + " result");
        return {
          message: "user registered",
          user: safeResult,
        };
      } catch (error) {
        console.log(error);
        throw new Error(error.toString());
      }
    },
  },
};
