import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const runSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  distance: { type: Number, required: true },
  date: { type: Date, required: true },
  hrs: { type: Number, required: true },
  mins: { type: Number, required: true },
  month: { type: Number },
  secs: { type: Number, required: true },
  week: { type: Number },
});

export default runSchema;
