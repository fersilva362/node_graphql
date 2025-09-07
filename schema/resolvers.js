import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worlsecretkey";

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
    users: async (obj, args, { prisma, userVerified }) => {
      if (!userVerified) {
        throw new Error("Invalid token");
      }
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
    fetchContacts: async (_, args, { prisma, userVerified }) => {
      if (!userVerified) {
        throw new Error("Invalid token");
      }
      const userId = userVerified.id;
      console.log(userId + "  userId ");
      try {
        const result = await prisma.contacts.findMany({
          where: {
            user_id: userId, // The user whose contacts we want
          },
          select: {
            contact_id: true,
            contact: { select: { username: true, email: true } },
          },
          orderBy: { contact: { username: "asc" } },
        });
        const safeResult = result.map((item) => ({
          ...item.contact,
          contact_id: item.contact_id.toString(),
        }));
        return safeResult;
      } catch (error) {
        console.log(error);
        throw new Error("error in fetching contacts");
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
    addContact: async (_, { email }, { prisma, userVerified }) => {
      if (!userVerified) {
        throw new Error("Invalid token");
      }
      let userId = null;
      if (userVerified.id) {
        userId = userVerified.id;
        console.log(`user is ${userVerified.id}`);
      }

      let contactId = 0;
      try {
        const result = await prisma.users.findMany({
          where: {
            email: email,
          },
        });
        console.log(result);
        if (result.length == 0) {
          return;
        } else {
          contactId = result[0].id;
          console.log("result.rows[0] " + contactId);
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }

      try {
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }

      try {
        const result = await prisma.contacts.create({
          data: {
            contact_id: contactId,
            user_id: userId,
          },
        });
        const safeResult = {
          ...result,

          user_id: result.user_id.toString(),
          contact_id: result.contact_id.toString(),
        };
        console.log(JSON.stringify(safeResult) + " safeResult");
        return { message: "todo ok", contact: safeResult };
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
      /* 

  try {
    console.log(contactId + "  contactId***");
    const result = await pool.query(
      `
      INSERT INTO contacts (contact_id, user_id) VALUES ($1,$2)  RETURNING *      
      `,
      [contactId, userId]
    );
    console.log("add Contact node server");
    console.log(`conversationId: ${contactId}`);
    console.log(`userId: ${userId}`);
    console.log(result.rows);
    if (result.rowCount == 0) {
      console.log("Contact already exists");
      res.status(201).json({ message: "Contact already exists" });
      //return;
    } else {
      console.log(result.rows);
      res.status(201).json({ message: "Success adding the contact" });
    }

    // res.status(201).json(result.rows);
    console.log(performance.now() - start);
  } catch (error) {
    res.status(500).json({ error });
  } */
    },
    recentContact: async (_, { email }, { prisma, userVerified }) => {
      if (!userVerified) {
        throw new Error("Invalid token");
      }
      let userId = null;
      if (userVerified.id) {
        userId = userVerified.id;
        console.log(`user is ${userVerified.id}`);
      }

      try {
        console.log(userId);
        const result = await prisma.contacts.findMany({
          where: {
            user_id: userId, // The user whose contacts we want
          },
          select: {
            contact_id: true,
            created_at: true,
            contact: { select: { username: true, email: true } },
          },
          orderBy: { created_at: "asc" },
          take: 6,
        });

        //quiero
        /* "contact_id": "1",
    "username": "fersilva",
    "email": "versilva@" */
        /*  "user_id": "4",
      "id": "54",
      "contact_id": "54",
      "created_at": "2025-07-01T01:29:07.931Z" */

        if (!result) {
          res.send("no va por acta");

          return;
        }
        console.log(result);
        const safeResult = result.map((item) => ({
          ...item.contact,
          contact_id: item.contact_id.toString(),
        }));
        console.log(safeResult);

        return safeResult;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    addOrCreateConversationPrisma: async (
      _,
      { contactId },
      { prisma, userVerified }
    ) => {
      if (!userVerified) {
        throw new Error("Invalid token");
      }
      let userId = null;
      if (userVerified.id) {
        userId = Number(userVerified.id);
      }
      if (!contactId) {
        throw new Error("no valido contactId");
      }
      contactId = Number(contactId);

      try {
        const result = await prisma.conversations.findMany({
          where: {
            OR: [
              {
                participant_one: contactId,
                participant_two: userId,
              },
              {
                participant_two: contactId,
                participant_one: userId,
              },
            ],
          },

          take: 1,
        });
        console.log(contactId + " contactID  " + " userId  " + userId);
        console.log(result.length + "result");

        if (result.length != 0) {
          const ConversatinIdExisting = result[0].id;

          return { conversationId: ConversatinIdExisting };
        }

        try {
          const newConversation = await prisma.conversations.create({
            data: { participant_two: contactId, participant_one: userId },
            select: { id: true },
          });
          console.log(newConversation.id.toString() + "newConversation.id");
          const newConversatinId = newConversation.id.toString();

          return { conversationId: newConversatinId };
        } catch (error) {
          console.log(error + " error in try add");
          throw new Error(error);
        }
      } catch (error) {
        console.log(error + " error in try add");
        throw new Error(error);
      }
    },
    saveMessagePrisma: async (
      _,
      { conversationId, senderId, content },
      { prisma, userVerified }
    ) => {
      try {
        const result = await prisma.messages.create({
          data: {
            conversation_id: conversationId,
            sender_id: Number(senderId),
            content: content,
          },
        });

        const safeResult = {
          ...result,
          sender_id: result.sender_id?.toString(),
        };

        return safeResult;
      } catch (error) {
        throw new Error("faile to save ");
      }
    },
    fetchAllMessageByConversationPrisma: async (
      _,
      { conversationId },
      { prisma, userVerified }
    ) => {
      console.log(conversationId);
      try {
        const response = await prisma.messages.findMany({
          where: { conversation_id: conversationId },
          select: {
            id: true,
            content: true,
            sender_id: true,
            conversation_id: true,
            created_at: true,
          },
          orderBy: { created_at: "asc" },
        });

        const safeResult = response.map((conversation) => ({
          ...conversation,
          id: conversation.id.toString(),
          sender_id: conversation.sender_id?.toString(),
          conversation_id: conversation.conversation_id?.toString(),
        }));
        console.log(JSON.stringify(safeResult) + " safeResult prisma");
        return safeResult;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  },
};

/*  */
