import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "worlsecretkey";

export const verifyToken = (authHeader) => {
  console.log("authHeader " + authHeader);
  if (!authHeader) {
    return undefined;
  }
  const token = authHeader?.split(" ")[1];

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
