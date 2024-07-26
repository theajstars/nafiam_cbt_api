import Joi from "@hapi/joi";

const defaultExaminationSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().optional(),
  batchID: Joi.string().optional(),
  isAdmin: Joi.boolean().optional(),
});

export const validateDefaultExaminationRequest = (req, res, next) => {
  const { error } = defaultExaminationSchema.validate(req.body);
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
const defaultBatchSchema = Joi.object({
  token: Joi.string().required(),
  batchID: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
});

export const validateDefaultBatchRequest = (req, res, next) => {
  const { error } = defaultBatchSchema.validate(req.body);
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
const createExminationBatchSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),
  students: Joi.array().required(),
  batch: Joi.number().required(),
});

export const validateCreateExaminationBatchRequest = (req, res, next) => {
  const { error } = createExminationBatchSchema.validate(req.body);
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
const getSingleExaminationBatchSchema = Joi.object({
  token: Joi.string().required(),
  batchID: Joi.string().required(),
});

export const validateGetSingleExaminationBatchRequest = (req, res, next) => {
  const { error } = getSingleExaminationBatchSchema.validate(req.body);
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

const createExaminationSchema = Joi.object({
  token: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.number().required(),
  duration: Joi.string().required(),
});

export const validateCreateExaminationSchema = (req, res, next) => {
  const { error } = createExaminationSchema.validate(req.body);
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
const editExaminationSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),
  questions: Joi.any().required(),
  title: Joi.string().required(),
  date: Joi.number().required(),
});

export const validateEditExaminationRequest = (req, res, next) => {
  const { error } = editExaminationSchema.validate(req.body);
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
const approveExaminationSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),
  questions: Joi.any().required(),
  isAdmin: Joi.boolean().optional(),
});

export const validateApproveExaminationRequest = (req, res, next) => {
  const { error } = approveExaminationSchema.validate(req.body);
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
const addStudentsToExaminationSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),
  students: Joi.any().required(),
});

export const validateAddStudentsToExaminationRequest = (req, res, next) => {
  const { error } = addStudentsToExaminationSchema.validate(req.body);
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
const validateExaminationPasswordSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().required(),
  password: Joi.string().required(),
});

export const validateExaminationPasswordRequest = (req, res, next) => {
  const { error } = validateExaminationPasswordSchema.validate(req.body);
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
const studentSubmitSchema = Joi.object({
  token: Joi.string().required(),
  examinationID: Joi.string().optional(),
  practiceID: Joi.string().optional(),
  questions: Joi.any().required(),
});

export const validateStudentSubmissionRequest = (req, res, next) => {
  const { error } = studentSubmitSchema.validate(req.body);
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
const studentBlacklistSchema = Joi.object({
  token: Joi.string().required(),
  batchID: Joi.string().required(),
  studentID: Joi.string().required(),
  action: Joi.string().required(),
});

export const validateStudentBlacklistRequest = (req, res, next) => {
  const { error } = studentBlacklistSchema.validate(req.body);
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
