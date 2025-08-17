/* _id
5a9427648b0beebeb69579e7
name
"Mercedes Tyler"
email
"mercedes_tyler@fakegmail.com"
movie_id
573a1390f29313caabcd4323
text
"Eius veritatis vero facilis quaerat fuga temporibus. Praesentium exped…"
date
2002-08-18T04:56:07.000+00:00 */

//import { ObjectId } from "mongodb";
export const commentTypeDef = `

type Query {
comments:[Comment]!

}

 type Comment{
 id: ID!
name: String
email: String
text:String
user:User
}
`;
export const resolvers = {
  Query: {
    comments: async (obj, arg, { mongo }) => {
      const response = await mongo.comments.find().limit(4).toArray();

      return response;
    },
  },
  Comment: {
    id: (obj) => (id = obj._id),
    user: async ({ email }, args, { mongo }) => {
      return await mongo.users.findOne({ email });
    },
  },
};
