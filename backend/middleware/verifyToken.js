// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Allow only super-admin to bypass
//     if (decoded.role === "super-admin") {
//       return res.status(403).json({
//         error: "Access restricted for super-admins only on this route.",
//       });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(403).json({ error: "Invalid or expired token." });
//   }
// };

// module.exports = verifyToken;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No auth header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info from token so routes can check roles
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // ✅ Let the route decide if the role is allowed
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
