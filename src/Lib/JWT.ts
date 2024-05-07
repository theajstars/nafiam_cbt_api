import jwt from "jsonwebtoken";

interface DecodedResults {
  id: string;
  user: "admin" | "student" | "instructor";
  iat: number;
  exp: number;
}

const verifyToken = (token: string) => {
  const isValid = jwt.verify(
    token,
    "AJD9W38(#*f(n#h9FAh#(!#bn",
    (err, decoded) => {
      if (err) {
        return { error: true };
      } else {
        return decoded;
      }
    }
  );
  return isValid as unknown as DecodedResults;
};

const createToken = async (
  id: string,
  user: "admin" | "student" | "instructor"
) => {
  const token = jwt.sign({ id: id, user }, "AJD9W38(#*f(n#h9FAh#(!#bn", {
    expiresIn: "7d",
  });
  return token;
};

export { createToken, verifyToken };
