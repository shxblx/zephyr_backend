import mongoose, { Model, Schema, Document } from "mongoose";
import UserLocation from "../../entities/userLocation";

// Define the user location schema
const userLocationSchema: Schema = new Schema<UserLocation>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

userLocationSchema.index({ location: '2dsphere' });

const UserLocationModel: Model<UserLocation & Document> = mongoose.model<
  UserLocation & Document
>("UserLocation", userLocationSchema);

export default UserLocationModel;