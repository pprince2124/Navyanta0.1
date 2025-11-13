import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // Always read from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired, please login again"
        : "Invalid or missing token";
    res.status(401).json({ success: false, message });
  }
};

export default authUser;