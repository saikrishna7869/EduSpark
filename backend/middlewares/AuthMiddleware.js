import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token =
  req.cookies?.jwt || req.headers["authorization"]?.split(" ")[1];

    console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(400).json({ message: "Invalid token" });
  }
};