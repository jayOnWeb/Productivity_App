const jwt = require("jsonwebtoken");
const User = require('../Models/User');
const protect = async (req, res, next) => {
  console.log("Middleware hit 🔥");

  const authHeader = req.headers.authorization;

  // Step 1: Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Step 2: Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Step 3: Verify token
    const decoded = jwt.verify(token, 'mysecretkey');

    const user = await User.findById(decoded._id).select("-password");

    // Step 4: Attach user to request
    req.user = user;
    console.log("Decoded user:", req.user);

    next(); // ✅ allow request to continue

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;