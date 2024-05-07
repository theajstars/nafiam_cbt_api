import Joi from "@hapi/joi";

const defaultInstructorSchema = Joi.object({
  token: Joi.string().required(),
  instructorID: Joi.string().optional(),
});

export const validateDefaultInstructorRequest = (req, res, next) => {
  const { error } = defaultInstructorSchema.validate(req.body);
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
