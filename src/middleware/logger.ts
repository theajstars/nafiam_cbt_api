import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    return oldWrite.apply(res, arguments);
  };

  //   @ts-ignore
  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);

    var body = Buffer.concat(chunks).toString("utf8");
    console.log(req.path, body);

    oldEnd.apply(res, arguments);
  };
  next();
};
