import { DefaultResponse } from "./Types";

export const UnauthorizedResponseObject = {
  status: true,
  statusCode: 401,
  message: "Unauthorized Request",
};

export const returnSuccessResponseObject = (message?: string) => {
  return <DefaultResponse>{
    status: true,
    statusCode: 200,
    message,
  };
};
