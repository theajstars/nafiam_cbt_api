import Joi from "@hapi/joi";

const defaultLectureRequestSchema = Joi.object({
  token: Joi.string().required(),
  courseID: Joi.string().optional(),
  lectureID: Joi.string().optional(),
});

export const validateDefaultLectureRequest = (req, res, next) => {
  const { error } = defaultLectureRequestSchema.validate(req.body);
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
const lectureCreateSchema = Joi.object({
  token: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  courseID: Joi.string().required(),
  files: Joi.array().required(),
});

export const validateCreateLectureRequest = (req, res, next) => {
  const { error } = lectureCreateSchema.validate(req.body);
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
const lectureUpdateSchema = Joi.object({
  token: Joi.string().required(),
  lectureID: Joi.string().optional(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  files: Joi.array().required(),
});

export const validateUpdateLectureRequest = (req, res, next) => {
  const { error } = lectureUpdateSchema.validate(req.body);
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
const createPracticeQuestionsSchema = Joi.object({
  token: Joi.string().required(),
  lectureID: Joi.string().required(),
  questions: Joi.array().required(),
});

export const validateCreatePracticeQuestionsRequest = (req, res, next) => {
  const { error } = createPracticeQuestionsSchema.validate(req.body);
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
const toggleLectureStatusSchema = Joi.object({
  token: Joi.string().required(),
  status: Joi.boolean().required(),
});

export const validateToggleLectureStatusRequest = (req, res, next) => {
  const { error } = toggleLectureStatusSchema.validate(req.body);
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
