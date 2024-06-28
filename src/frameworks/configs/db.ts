import mongoose from "mongoose";


const connectDB=async ()=>{

    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI!, { dbName: 'zephyr' });
        console.log("Connected to database");
    } catch (error: any) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;