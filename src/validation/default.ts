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
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  navigatorObject: Joi.any().required(),
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
const updateProfileSchema = Joi.object({
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  serviceNumber: Joi.string().optional(),
  rank: Joi.string().optional(),
});

export const validateDefaultProfileUpdateRequest = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
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
const findUserSchema = Joi.object({
  token: Joi.string().required(),
  userCase: Joi.string().required(),
  searchString: Joi.string().optional().allow(""),
  rank: Joi.string().optional().allow(""),
  gender: Joi.string().optional().allow(""),
});

export const validateDefaultFindUserRequest = (req, res, next) => {
  const { error } = findUserSchema.validate(req.body);
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
