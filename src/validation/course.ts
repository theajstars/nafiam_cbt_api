import Joi from "@hapi/joi";
import { CourseProps } from "../models/Course";
import { MaterialProps } from "../models/Material";

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
  } else {
    next();
  }
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
  } else {
    next();
  }
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
  } else {
    next();
  }
};

const updateSchema = Joi.object<
  CourseProps & { token: string; courseID: string }
>({
  courseID: Joi.string().required(),
  token: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().required(),
  department: Joi.string().required(),
  title: Joi.string().required(),
});

export const validateUpdateCourse = (req, res, next) => {
  const { error } = updateSchema.validate(req.body);
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

const createCourseMaterialSchema = Joi.object<
  MaterialProps & { token: string }
>({
  courseID: Joi.string().required(),
  token: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  category: Joi.string().required(),
  file: Joi.string().required(),
});

export const validateCreateCourseMaterial = (req, res, next) => {
  const { error } = createCourseMaterialSchema.validate(req.body);
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
const getAllCourseMaterialsSchema = Joi.object<
  MaterialProps & { token: string }
>({
  courseID: Joi.string().required(),
  token: Joi.string().required(),
});

export const validateGetAllCourseMaterials = (req, res, next) => {
  const { error } = getAllCourseMaterialsSchema.validate(req.body);
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
const deleteCourseMaterialSchema = Joi.object<{
  token: string;
  materialID: string;
}>({
  materialID: Joi.string().required(),
  token: Joi.string().required(),
});

export const validateDeleteCourseMaterialSchema = (req, res, next) => {
  const { error } = deleteCourseMaterialSchema.validate(req.body);
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
