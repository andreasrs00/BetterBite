const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");

const authScheme = () => {
  return {
    authenticate: async (request, h) => {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
          throw new Error("Token tidak ditemukan");
        }

        if (!authHeader.startsWith("Bearer ")) {
          throw new Error("Format token tidak valid");
        }

        const token = authHeader.substring(7);
        if (!token) {
          throw new Error("Token kosong");
        }

        const decoded = verifyToken(token);

        return h.authenticated({ credentials: decoded });
      } catch (err) {
        console.error("Auth scheme error:", err.message);

        return h
          .response(errorResponse(err.message || "Unauthorized", 401))
          .code(401)
          .takeover();
      }
    },
  };
};

module.exports = authScheme;
