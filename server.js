import express from "express";
import dotenv from "dotenv";
dotenv.config();
import eventRoute from "./routes/event.js";
import userRoute from "./routes/user.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Event Management API is running.");
});

const PORT = 3000;
app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
