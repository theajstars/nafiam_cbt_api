import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";
import { MaterialProps } from "../models/Material";

const getAllExaminationsSchema = Joi.object({
  token: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
});

export const validateGetAllExaminations = (req, res, next) => {
  const { error } = getAllExaminationsSchema.validate(req.body);
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
