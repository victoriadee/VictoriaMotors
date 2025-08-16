import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/database"; // <-- fixed import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("VictoriaMotors Backend Running 🚗");
});

// Example cars route
import carRoutes from "./routes/carRoutes";
app.use("/api/cars", carRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
