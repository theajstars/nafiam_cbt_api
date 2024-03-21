import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";
import { MaterialProps } from "../models/Material";

const loginValidationSchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string().required(),
  navigatorObject: Joi.any().required(),
});

export const validateLoginRequest = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body);
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
const updatePasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
  user: Joi.valid("student", "lecturer", "admin").required(),
});

export const validateUpdatePasswordRequest = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body);
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
