export class CustomError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// 400 Client Errors
export class BadRequestError extends CustomError {
  constructor(public message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(public message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(public message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends CustomError {
  constructor(public message: string = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends CustomError {
  constructor(public message: string = 'Resource already exists') {
    super(409, message);
  }
}

// 500 Server Errors
export class InternalServerError extends CustomError {
  constructor(public message: string = 'Internal Server Error') {
    super(500, message);
  }
}

export class NotImplementedError extends CustomError {
  constructor(public message: string = 'Not Implemented') {
    super(501, message);
  }
}
