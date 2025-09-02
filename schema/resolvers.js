import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    users: async (obj, args, { prisma, userVerified }) => {
      if (!userVerified) {
        throw new Error("Invalid token");
      }
      console.log(prisma);
      try {
        const users = await prisma.users.findMany();
        const safeResultArray = users.map((result) => ({
          ...result,
          password: undefined,
          id: result.id.toString(),
        }));
        return safeResultArray;
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

    loginUser: async (_, { user }, { prisma }) => {
      try {
        const myUser = await prisma.users.findFirst({
          where: { email: user.email },
        });
        if (!myUser) {
          console.log("not match password user");
          return;
        }
        const isMatched = await bcrypt.compare(user.password, myUser.password);
        if (!isMatched) {
          console.log("not match password user");
          return;
        }
        const token = jwt.sign({ id: myUser.id.toString() }, JWT_SECRET, {
          expiresIn: "1h",
        });
        const safeResult = {
          ...myUser,
          password: undefined,
          id: myUser.id.toString(),
        };
        console.log(safeResult + " result");
        return {
          message: "user registered",
          user: safeResult,
          token: token,
        };
      } catch (error) {
        console.log(error);
        throw new Error(error.toString());
      }
    },
  },
};
