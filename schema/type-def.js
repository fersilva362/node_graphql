import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User!]!
    fetchContacts: [Contact!]
    fetchConversations: [FetcConversationType!]
    fetchRecentContacts: [MyRecentContacts]
    fetchAllMessageByConversation(conversationId: String): [FetchMessageType]
  }

  type Mutation {
    createUser(user: InputRegister): ResponseRegister
    loginUser(user: InputLogin): ResponseLogin
    addContact(email: String): ResponseContact
    recentContact(email: String): [RecentContact]!
    addOrCreateConversationPrisma(
      contactId: String!
    ): ResponseAddOrFetchConversation
    saveMessagePrisma(
      conversationId: String!
      senderId: String!
      content: String!
    ): Conversation!
    fetchAllMessageByConversationPrisma(
      conversationId: String!
    ): [Conversation]!
  }
  type ResponseAddOrFetchConversation {
    conversationId: String
  }
  type ResponseContact {
    message: String!
    contact: Contact
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
    email: String!
    username: String!
    contact_id: ID!
  }
  type RecentContact {
    username: String!
    email: String!
    contact_id: String!
  }
  type Conversation {
    id: String!
    conversation_id: String!
    sender_id: String!
    content: String!
  }

  type FetcConversationType {
    conversation_id: String!
    participant_name: String!
    last_message: String
    last_message_time: String
  }

  type FetchRecentContactType {
    contact_id: String!
    created_at: String!
    contact: MyRecentContacts
  }
  type MyRecentContacts {
    contact_id: String!
    username: String!
    email: String!
    # Remove contact_id and created_at from here
  }
  type FetchMessageType {
    id: String!
    sender_id: String!
    content: String!
    created_at: String!
    conversation_id: String!
  }
`;

/* 


*/
