const admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
    try {
        const { email, password, key } = req.body;
        if (key !== "patoli123") {
            return res.status(403).json({
                message: "invalid key"
            });
        }
        const existing = await admin.findOne({ email })
        if (existing) {
            return res.status(400).json({
                message: "Admin already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const Admin = await admin.create({
            email, password: hash
        })
        res.status(200).json({
            message: "registered successfully"
        });


    }
    catch (err) {
        res.status(400).json({
            message: err.message
        });
    }

}
const login = async (req, res) => {
    try {
        const { em, pass } = req.body;   // ← fixed: matches what frontend sends
        const user = await admin.findOne({ email: em });
        if (!user) {
            return res.status(401).json({ message: "user does not exist" });
        }

        const ismatch = await bcrypt.compare(pass, user.password);
        if (ismatch) {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,   // ← fixed: no more hardcoded "secretkey"
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "login successful",
                token   // ← fixed: token now actually sent back
            });
        } else {
            return res.status(401).json({ message: "password is wrong" });
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports = { register, login };