import Joi from "@hapi/joi";

const defaultPracticeSchema = Joi.object({
  token: Joi.string().required(),
  lectureID: Joi.string().optional(),
  practiceID: Joi.string().optional(),
  studentID: Joi.string().optional(),
});

export const validateDefaultPracticeRequest = (req, res, next) => {
  const { error } = defaultPracticeSchema.validate(req.body);
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
