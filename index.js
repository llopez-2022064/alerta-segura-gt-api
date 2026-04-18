import { connectDB } from "./src/config/database.js";
import { startServer } from "./src/config/app.js";

connectDB();
startServer();