import jwt, { decode } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "worlsecretkey";

export const verifyToken = (authHeader) => {
  if (!authHeader) {
    return undefined;
  }

  const arrayToken = authHeader?.split(" ");
  console.log(arrayToken + ">arrayToken");
  let token = "";
  if (arrayToken[1]) {
    token = arrayToken[1];
  } else {
    token = authHeader;
  }
  console.log(arrayToken[1]);
  console.log(token + " verify token");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    //console.log(decoded + " decoded");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
