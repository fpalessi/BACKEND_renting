import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);
export default User;
