import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User!]!
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
