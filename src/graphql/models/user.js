import { ObjectId } from "mongodb";
import { commentTypeDef as Comment } from "./comments.js";
export const userTypeDef = `

type Query {
user(id:ID!):User,
users:[User!]!,

}
type Mutation {
createUser(user:newUser!):User
deleteUser(id:ID!):Boolean
updateUser(id:ID!, update:newUpdate):User
}
input newUpdate{name:String!}
input newUser {
name:String!
email: String!
password:String!
}
type User {
      id: ID!

name: String

email: String

password:String
comments:[Comment]!

    }`;

export const resolvers = {
  Query: {
    user: async (obj, { id }, { mongo }) => {
      try {
        const user = await mongo.users.findOne({ _id: new ObjectId(id) });

        return user;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
    users: async (obj, _, { mongo }) => {
      try {
        const users = await mongo.users.find().limit(4).toArray();
        return users;
      } catch (error) {
        return [];
      }
    },
  },
  Mutation: {
    createUser: async (_, { user }, { mongo }) => {
      const response = await mongo.users.insertOne(user);

      const usuario = { ...user };

      return usuario;
    },
    deleteUser: async (obj, { id }, { mongo }) => {
      const response = await mongo.users.deleteOne({ _id: new ObjectId(id) });

      return response.deletedCount != 0 ? true : false;
    },
    updateUser: async (obj, { id, update }, { mongo }) => {
      const response = await mongo.users.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            name: update.name,
          },
        },
        { returnDocument: "after" }
      );

      return response;
    },
  },

  User: {
    id: (obj) => obj._id,
    comments: async ({ email }, _, { mongo }) => {
      const response = await mongo.comments.find({ email }).limit(4).toArray();

      return response;
    },
  },
};
