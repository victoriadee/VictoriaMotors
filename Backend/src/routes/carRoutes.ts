import { Router } from "express";
import Car from "../models/Car";

const router = Router();

// GET all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST add a car
router.post("/", async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

export default router;
