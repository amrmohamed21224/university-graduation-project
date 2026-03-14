
// Utility functions for standardized API responses
exports.successResponse = (message, data = {}) => {
    return {
        success: true,
        message,
        data
    };
};

exports.errorResponse = (message) => {
    return {
        success: false,
        error: message
    };
};