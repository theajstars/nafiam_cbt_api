import Joi from "@hapi/joi";

const defaultLectureRequestSchema = Joi.object({
  token: Joi.string().required(),
  courseID: Joi.string().required(),
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
