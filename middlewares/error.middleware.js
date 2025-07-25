const errorMiddleware = (err, req, res, next) => {
    try {

      let errors = {
        message: err.message,
        name: err.name,
        code: err.code,
        statusCode: err.statusCode
      }

      // MongoDB CastError (Bad ObjectId)
      if (errors.name === 'CastError') {
        errors.message = 'Resource not found';
        errors.statusCode = 404;
      }

      // MongoDB Duplicate Key
      if (errors.code === 11000) {
        errors.message = 'Duplicate field value entered';
        errors.statusCode = 400;
      }

      // Mongoose Validation Errors
      if (errors.name === 'ValidationError' && err.errors) {
        const messages = Object.values(err.errors).map(error => error.message).join(', ');
        errors.message = messages;
        errors.statusCode = 400;
      }

      res.status(errors.statusCode || 500).json({
        success: false,
        error: errors.message || 'Server Error',
      });

    } catch (error) {
        next (error);
    }
}

export default errorMiddleware;