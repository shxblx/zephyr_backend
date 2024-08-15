import mongoose from "mongoose";

interface UserLocation {
  userId: mongoose.Types.ObjectId;
  location: {
    type: "Point";
    coordinates: [number, number]; 
  };
}

export default UserLocation;
