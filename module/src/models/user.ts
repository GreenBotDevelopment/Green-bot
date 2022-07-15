import { Schema, model } from "mongoose";

const userSchemaData = new Schema({
    userID: { type: String, required: true },
    playlists: { type: Array, required: true },
    songs: { type: Array, required: false, default: [] },
})

const userSchema = model("user", userSchemaData);
export { userSchema }