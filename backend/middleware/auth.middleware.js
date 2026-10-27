
import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  // Check that the JWT secret is configured.
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({
      message: "Internal server error",
    });
  }

  // Read the Authorization header.
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Extract the token after "Bearer ".
  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    // Verify the token and attach its decoded payload to the request.
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    // Continue to the next middleware or route handler.
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}