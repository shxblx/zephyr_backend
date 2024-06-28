import app from "./frameworks/configs/app";
import connectDB from "./frameworks/configs/db";

connectDB();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server started running");
});
