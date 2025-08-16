import mongoose, { Schema, Document } from "mongoose";

export interface ICar {
  make: string;
  model: string;
  year: number;
  price: number;
}

const CarSchema: Schema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<ICar & Document>("Car", CarSchema);
