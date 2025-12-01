const jwt = require("jsonwebtoken");

// Secret key harus sama dengan yang digunakan di authcontroller.js
const SECRET_KEY = "kunci_rahasia_griya_mdp";

/**
 * Middleware untuk verifikasi JWT Bearer Token
 * Token harus dikirim di header: Authorization: Bearer <token>
 */
const verifyToken = (req, res, next) => {
  try {
    // Ambil token dari Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu."
      });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Format token tidak valid. Gunakan: Bearer <token>"
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Simpan data user ke req.user untuk digunakan di controller
    req.user = decoded;
    
    // Lanjutkan ke controller
    next();

  } catch (error) {
    console.error("Token Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token sudah expired. Silakan login kembali."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat verifikasi token."
    });
  }
};

module.exports = { verifyToken };
