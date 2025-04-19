import { httpServer } from "./frameworks/configs/app";
import connectDB from "./frameworks/configs/db";

connectDB();

const app = httpServer;
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`server started running on port ${PORT}`);
});
