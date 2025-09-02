import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User!]!
  }
  type Mutation {
    createUser(user: InputRegister): ResponseRegister
    loginUser(user: InputLogin): ResponseLogin
  }
  type ResponseRegister {
    message: String!
    user: User
  }
  type ResponseLogin {
    message: String!
    user: User
    token: String!
  }
  input InputRegister {
    username: String!
    email: String!
    password: String!
  }
  input InputLogin {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    username: String
    email: String
    password: String
    contacts: [Contact]
  }

  type Contact {
    user_id: ID!
    id: ID!
    contact_id: ID!
  }
`;
