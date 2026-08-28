const jwt = require("jsonwebtoken");
const User = require('../Models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Step 1: Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Step 2: Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Step 3: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Step 4: Attach user to request
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;