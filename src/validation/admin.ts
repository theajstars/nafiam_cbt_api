import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";
import { MaterialProps } from "../models/Material";

const onboardstudentSchema = Joi.object({
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
});

export const validateOnboardStudent = (req, res, next) => {
  const { error } = onboardstudentSchema.validate(req.body);
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
