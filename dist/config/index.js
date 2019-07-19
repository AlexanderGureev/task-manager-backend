"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodbConfig = {
    username: encodeURIComponent("test"),
    password: encodeURIComponent("test"),
    database: "test"
};
exports.config = {
    PORT: process.env.PORT || "8080",
    HOST: process.env.HOST || "0.0.0.0",
    ENV: process.env.ENV || "development",
    SESSION_PREFIX: "session",
    JWT_SECRET: "test",
    API_VERSION: "1.0.0",
    MONGO_URI: process.env.MONGO_URI ||
        `mongodb://${mongodbConfig.username}:${mongodbConfig.password}@localhost:27017/${mongodbConfig.database}`,
    REDIS_URI: process.env.REDIS_URI || `redis://localhost:6379`,
    plugins: ["swagger", "logger", "cookie", "auth", "redisCache", "cors"]
};
//# sourceMappingURL=index.js.map