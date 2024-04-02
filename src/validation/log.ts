import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";

const getAllLogsSchema = Joi.object({
  token: Joi.string().required(),
  timestamp: Joi.number().optional(),
  personnelID: Joi.string().optional(),
  userType: Joi.string().optional(),
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  type: Joi.string().optional(),
});

export const validateGetAllLogsRequest = (req, res, next) => {
  const { error } = getAllLogsSchema.validate(req.body);
  if (error) {
    const errorResponse = error.details.map((e) => {
      return e.message;
    });
    res.json({
      status: true,
      statusCode: 400,
      message: errorResponse.toString(),
    });
  } else {
    next();
  }
};
