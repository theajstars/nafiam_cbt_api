import Joi from "@hapi/joi";

const createSchema = Joi.object({
  email: Joi.string().email().required(),
});
