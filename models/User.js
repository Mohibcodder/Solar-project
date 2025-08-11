import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'technician', 'admin'],
    required: true,
  },
  profile: {
      phone: String,
      address: String,
      expertise: String, // For technicians
      profilePicture: String,
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);