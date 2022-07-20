"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const userSchemaData = new mongoose_1.Schema({
    userID: { type: String, required: true },
    playlists: { type: Array, required: true },
    songs: { type: Array, required: false, default: [] },
});
const userSchema = (0, mongoose_1.model)("user", userSchemaData);
exports.userSchema = userSchema;
