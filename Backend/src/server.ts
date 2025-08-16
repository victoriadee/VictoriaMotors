import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/database";
import carRoutes from "./routes/carRoutes";
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("VictoriaMotors Backend Running 🚗");
});

// Example cars route
app.use("/api", (req: Request, res: Response) => {
  res.send("API Endpoint");
});
app.use("/api/cars", carRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
