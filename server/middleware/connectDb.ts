import mongoose from 'mongoose';
require('dotenv').config();

const connectDb = handler => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (e) {
      console.log(
        'getting an error? are you working at a coffee shop? try adding IP to whitelist on mongo cluster',
        e
      );
    }
  }

  return handler(req, res);
};

const db = mongoose.connection;

db.once('open', () => {
  console.log('connected to mongo');
});

export default connectDb;
