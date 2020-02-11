import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  userId: String,
  image: String,
  title: { type: String, default: 'title' },
  created: {
    type: Date,
    default: Date.now,
  },
  elevationData: [
    [
      {
        elevation: Number,
        distance: Number,
      },
    ],
  ],
  startPoint: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number],
  },
  endPoint: [Number],
  viewport: {
    latitude: Number,
    longitude: Number,
    zoom: Number,
    bearing: Number,
    pitch: Number,
  },
  pointFeatures: [
    {
      type: {
        type: { type: String },
      },
      properties: {
        color: String,
      },
      geometry: {
        type: {
          type: { type: String },
        },
        coordinates: [Number],
      },
    },
  ],
  lineFeatures: [
    {
      type: {
        type: { type: String },
      },
      properties: {
        color: String,
      },
      geometry: {
        type: {
          type: { type: String },
        },
        coordinates: [[Number]],
      },
    },
  ],
  distance: [Number],
});

// const Route = mongoose.model('Route', routeSchema);

export default routeSchema;
