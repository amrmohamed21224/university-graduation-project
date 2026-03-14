const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "alert-system-local-dev-secret";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(errorResponse("No token provided"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json(errorResponse("Token is invalid or expired"));
    }
};

module.exports = authMiddleware;