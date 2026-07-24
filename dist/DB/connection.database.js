"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/user.model");
const connectDB = async () => {
    try {
        const result = await (0, mongoose_1.connect)(process.env.DB_URL, {
            serverSelectionTimeoutMS: 30000,
        });
        await user_model_1.UserModel.syncIndexes();
        console.log(result.models);
        console.log("Database Connected Successfully 🚀");
    }
    catch (error) {
        console.error("Failed to Connect Database ❌", error);
    }
};
exports.default = connectDB;
//# sourceMappingURL=connection.database.js.map