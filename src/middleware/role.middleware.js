const { errorResponse } = require("../utils/response");

const roleMiddleware = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(errorResponse("Access denied: insufficient permissions"));
        }
        next();
    };
};

module.exports = roleMiddleware;