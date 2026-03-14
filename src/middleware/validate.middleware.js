const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/response");

const validateMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Join all error messages into a single string
        const msg = errors.array().map(e => e.msg).join(", ");
        return res.status(400).json(errorResponse(msg));
    }
    next();
};

module.exports = validateMiddleware;