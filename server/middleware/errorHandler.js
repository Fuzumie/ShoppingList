const formatJoiErrors = (error) => {
    const errors = {};
    error.details.forEach((detail) => {
      const field = detail.path.join(".");
      errors[field] = detail.message;
    });
    return errors;
  };
  
  const errorHandler = (err, req, res, next) => {

    if (err.isJoi) {
      const formattedErrors = formatJoiErrors(err);
      return res.status(400).json({
        message: "Validation failed",
        details: formattedErrors,
      });
    }
  

    if (err.statusCode) {
      return res.status(err.statusCode).json({
        message: err.message || "An error occurred",
      });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred.",
    });
  };
  
  module.exports = { errorHandler };
  