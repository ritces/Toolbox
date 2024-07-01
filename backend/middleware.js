import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from "./apiKeys.js"

//Middleware to protect 
const verifyToken = (req, res, next) => {
  const header = req.header("Authorization");
  const token = header?.split(" ")?.[1];
  if (!token) return res.status(401).send({ message: "User Not authorized" });
  try {
    const verified = jwt.verify(token, TOKEN_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Token not valid" });
  }
};

//Middleware to handle not found
const notFoundHandler = (req, res, next) => {
  res.status(404).send({ message: "Route not found" });
}

export { verifyToken, notFoundHandler }