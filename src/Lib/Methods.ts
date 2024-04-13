import bcrypt from "bcryptjs";
import fs from "fs";
export const generateRandomString = (
  length: number,
  charset: "ALL" | "ALPHABET" = "ALL"
) => {
  let result = "";
  const characters =
    charset === "ALL"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
export const genPassword = async (password: string) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  console.log("Thine Hash", hash);
  return hash;
};

export const returnUnlessUndefined = (param: string) => {
  return param && param.length > 0 ? param : undefined;
};
export const removeEmptyFields = (obj: any) => {
  for (let key in obj) {
    if (obj[key] === "" || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};

export const deleteFolderRecursive = (path: string) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
