import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";
import { MaterialProps } from "../models/Material";

const getAllLogsSchema = Joi.object({
  timestamp: Joi.number().optional(),
  personnelID: Joi.string().optional(),
  page: Joi.string().optional(),
  limit: Joi.string().optional(),
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
