import { DefaultResponse } from "./Responses";

export const UnauthorizedResponseObject = {
  status: true,
  statusCode: 401,
  message: "Unauthorized Request",
};

export const returnSuccessResponseObject = (
  message?: string,
  statusCode?: number,
  data?: any
) => {
  return <DefaultResponse>{
    status: true,
    statusCode: statusCode ?? 200,
    message,
    data,
  };
};
