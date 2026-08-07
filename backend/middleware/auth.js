const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).json({
            message: "no token"
        });
    }
    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, "secretkey")
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }


}
module.exports = auth