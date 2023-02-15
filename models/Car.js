import mongoose from "mongoose";

const CarSchema = mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  location: { type: String, required: true },
  photos: { type: [String], required: true },
  description: { type: String, required: true },
  seats: {
    type: String,
    required: true,
    enum: [
      "2 personas",
      "4 personas",
      "5 personas",
      "7 personas",
      "9 personas",
    ],
  },
  doors: {
    type: String,
    required: true,
    enum: ["3 puertas", "5 puertas", "7 puertas"],
  },
  transmission: {
    type: String,
    required: true,
    enum: ["Manual", "Automatico"],
  },
  aircon: {
    type: String,
    required: true,
    enum: ["Con aire acond.", "Sin aire acond."],
  },
  trunk: {
    type: String,
    required: true,
    enum: ["1 maleta", "2 maletas", "3 maletas"],
  },
  consumption: {
    type: String,
    required: true,
    enum: ["Bajo", "Alto"],
  },
  price: {
    type: String,
    required: true,
  },
});

const Car = mongoose.model("Car", CarSchema);
export default Car;
