import mongoose from 'mongoose';
import bcyrpt from 'bcrypt';
import routeSchema from './route';
import runSchema from './run';
const Schema = mongoose.Schema;

// Define out model
const userSchema = new Schema({
  username: { type: String, unique: true, lowercase: true },
  password: String,
  routes: [routeSchema],
  runlog: [runSchema],
  goal: { type: Number, default: 0 },
});

//On save hook, encrypt password
// Run before saving a a model to the datbase

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcyrpt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);

    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.models.user || mongoose.model('user', userSchema);

// Export the model
export default ModelClass;
