import Joi from "@hapi/joi";

const onboardstudentSchema = Joi.object({
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  rank: Joi.string().required(),
  trade: Joi.string().required(),
  unit: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
  serviceNumber: Joi.string().required().allow(""),

  school: Joi.string().required(),
});

export const validateOnboardStudent = (req, res, next) => {
  const { error } = onboardstudentSchema.validate(req.body);
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

const createInstructorSchema = Joi.object({
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  rank: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
  serviceNumber: Joi.string().required().allow(""),
  school: Joi.string().required(),
});

export const validateCreateInstructor = (req, res, next) => {
  const { error } = createInstructorSchema.validate(req.body);
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
const updateInstructorSchema = Joi.object({
  token: Joi.string().required(),
  instructorID: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  rank: Joi.string().required(),
  gender: Joi.string().required(),
  role: Joi.string().required(),
  serviceNumber: Joi.string().required().allow(""),

  school: Joi.string().required(),
});

export const validateUpdateInstructor = (req, res, next) => {
  const { error } = updateInstructorSchema.validate(req.body);
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
const singleInstructorSchema = Joi.object({
  token: Joi.string().required(),
  instructorID: Joi.string().required(),
});

export const validateSingleInstructorRequest = (req, res, next) => {
  const { error } = singleInstructorSchema.validate(req.body);
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
const updateStudentSchema = Joi.object({
  token: Joi.string().required(),
  studentID: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  rank: Joi.string().required(),
  gender: Joi.string().required(),
  school: Joi.string().required(),
  role: Joi.string().required(),
  serviceNumber: Joi.string().required().allow(""),
});

export const validateUpdateStudent = (req, res, next) => {
  const { error } = updateStudentSchema.validate(req.body);
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
const createSchoolSchema = Joi.object({
  token: Joi.string().required(),
  name: Joi.string().required(),
  dean: Joi.string().optional().allow(""),
});

export const validateCreateSchoolRequest = (req, res, next) => {
  const { error } = createSchoolSchema.validate(req.body);
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
const updateSchoolSchema = Joi.object({
  token: Joi.string().required(),
  schoolID: Joi.string().required(),
  name: Joi.string().required(),
  dean: Joi.string().required(),
});

export const validateUpdateSchoolRequest = (req, res, next) => {
  const { error } = updateSchoolSchema.validate(req.body);
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
const singleSchoolSchema = Joi.object({
  token: Joi.string().required(),
  schoolID: Joi.string().required(),
});

export const validateSingleSchoolRequest = (req, res, next) => {
  const { error } = singleSchoolSchema.validate(req.body);
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
const createAdminSchema = Joi.object({
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  serviceNumber: Joi.string().required(),
  rank: Joi.string().required(),
  school: Joi.string().optional(),
});

export const validateCreateAdminRequest = (req, res, next) => {
  const { error } = createAdminSchema.validate(req.body);
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
const updateAdminSchema = Joi.object({
  adminID: Joi.string().required(),
  token: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  serviceNumber: Joi.string().required(),
  rank: Joi.string().required(),
  school: Joi.string().optional(),
});

export const validateUpdateAdminRequest = (req, res, next) => {
  const { error } = updateAdminSchema.validate(req.body);
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
