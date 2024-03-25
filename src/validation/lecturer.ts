import Joi from "@hapi/joi";

const defaultLecturerSchema = Joi.object({
  token: Joi.string().required(),
  lecturerID: Joi.string().optional(),
});

export const validateDefaultLecturerRequest = (req, res, next) => {
  const { error } = defaultLecturerSchema.validate(req.body);
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
