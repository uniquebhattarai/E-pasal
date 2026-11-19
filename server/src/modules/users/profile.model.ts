import mongoose, { Schema } from "mongoose";
import { IProfile } from "../../types";

const profileSchema = new Schema<IProfile>({
  gender: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: String,
    default: null,
  },
  about: {
    type: String,
    trim: true,
    default: null,
  },
  contactNumber: {
    type: Number,
    default: null,
  },
});

export const Profile = mongoose.model<IProfile>("profile", profileSchema);
export default Profile;
