const User = require("./auth.model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "alert-system-local-dev-secret";

// ========================
// Register
// ========================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        // Check if email exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) return res.error("Email already exists", 400);

        // Create user (password hash handled in model)
        const user = await User.create({ name, email: normalizedEmail, password });

        const data = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        return res.success("User registered successfully", data, 201);

    } catch (err) {
        return res.error(err.message, 500);
    }
};

// ========================
// Login
// ========================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) return res.error("Invalid credentials", 400);

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.error("Invalid credentials", 400);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.success("Operation successful", { accessToken: token });

    } catch (err) {
        return res.error(err.message, 500);
    }
};

// ========================
// Get current user
// ========================
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.error("User not found", 404);

        return res.success("User data fetched", user);
    } catch (err) {
        return res.error(err.message, 500);
    }
};

// ========================
// Delete account
// ========================
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) return res.error("User not found", 404);

        return res.success("Account deleted successfully");
    } catch (err) {
        return res.error(err.message, 500);
    }
};

// ========================
// Update profile
// ========================
exports.updateProfile = async (req, res) => {
    try {
        const updates = { ...req.body };

        if (updates.password) delete updates.password;

        if (updates.email) {
            updates.email = updates.email.toLowerCase();
            const existingUser = await User.findOne({
                email: updates.email,
                _id: { $ne: req.user.id }
            });

            if (existingUser) return res.error("Email already exists", 400);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.error("User not found", 404);

        return res.success("Profile updated", user);
    } catch (err) {
        return res.error(err.message, 500);
    }
};
