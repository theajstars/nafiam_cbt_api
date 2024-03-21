import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";
import { MaterialProps } from "../models/Material";

const updateStudentProfileSchema = Joi.object({
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
});

export const validateUpdateStudentProfileRequest = (req, res, next) => {
  const { error } = updateStudentProfileSchema.validate(req.body);
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
const getSingleResultSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),
  studentID: Joi.string().optional(),
});

export const validateGetSingleResultRequest = (req, res, next) => {
  const { error } = getSingleResultSchema.validate(req.body);
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
const getAllStudentResultsSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),

  studentID: Joi.string().optional(),
});

export const validateGetAllStudentinResultsRequest = (req, res, next) => {
  const { error } = getAllStudentResultsSchema.validate(req.body);
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
const getOneStudentAllResultSchema = Joi.object({
  token: Joi.string().required(),
  studentID: Joi.string().optional(),
});

export const validateGetOneStudentAllResultRequest = (req, res, next) => {
  const { error } = getOneStudentAllResultSchema.validate(req.body);
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
