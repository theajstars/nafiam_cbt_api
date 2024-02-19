import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";

const createSchema = Joi.object<CourseProps & { token: string }>({
  token: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().required(),
  department: Joi.string().required(),
  title: Joi.string().required(),
});

export const validateCreateCourse = (req, res, next) => {
  const { error } = createSchema.validate(req.body);
  if (error) {
    const errorResponse = error.details.map((e) => {
      return e.message;
    });
    res.json({
      status: true,
      statusCode: 400,
      message: errorResponse.toString(),
    });
  }
  next();
};

const getAllSchema = Joi.object({
  token: Joi.string().required(),
  lecturerID: Joi.string().optional(),
});
export const validateGetAllCourses = (req, res, next) => {
  const { error } = getAllSchema.validate(req.body);

  if (error) {
    const errorResponse = error.details.map((e) => {
      return e.message;
    });
    res.json({
      status: true,
      statusCode: 400,
      message: errorResponse.toString(),
    });
  }
  next();
};

const getSingleSchema = Joi.object({
  token: Joi.string().required(),
  courseID: Joi.string().required(),
});
export const validateGetSingleCourseSchema = (req, res, next) => {
  const { error } = getSingleSchema.validate(req.body);

  if (error) {
    const errorResponse = error.details.map((e) => {
      return e.message;
    });
    res.json({
      status: true,
      statusCode: 400,
      message: errorResponse.toString(),
    });
  }
  next();
};
