import authUser from "./authUser.js";

const authAdmin = (req, res, next) => {
  authUser(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  });
};

export default authAdmin;

