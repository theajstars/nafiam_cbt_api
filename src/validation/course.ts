import Joi from "@hapi/joi";

const createSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const validateCreateCourse = (req, res, next) => {
  const { error } = createSchema.validate(req.body);
  console.log(error, error);
  const errorResponse = error.details.map((e) => {
    return e.message;
  });
  if (error) {
    res.json({
      status: true,
      statusCode: 400,
      message: errorResponse.toString(),
    });
  }
  next();
};
