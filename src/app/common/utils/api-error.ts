class APIError extends Error {
    public statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: any = "Bad Request") {
        return new APIError(400, message);
    }

    static notfound(message: any = "Not Found") {
        return new APIError(404, message);
    }

    static unauthorized(message: any = "unauthorized access") {
        return new APIError(401, message);
    }

}

export default APIError;