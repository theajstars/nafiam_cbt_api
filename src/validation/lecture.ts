import Joi from "@hapi/joi";

const lectureCreateSchema = Joi.object({
  token: Joi.string().required(),
  title: Joi.string().required(),
  courseID: Joi.string().required(),
  description: Joi.string().required(),
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
