const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // maximum 5 attempts
    message: {
        message: "Too many login attempts, try again later"
    }
});

module.exports = loginLimiter;