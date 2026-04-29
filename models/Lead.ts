import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  propertyInterest: {
    type: String,
    required: true,
    enum: ['House', 'Plot', 'Apartment', 'Commercial', 'Other'],
  },
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Closed'],
    default: 'New',
  },
  notes: {
    type: String,
    default: '',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  score: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
  },
  followUpDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

LeadSchema.pre('save', function (next) {
  // Auto-calculate score based on budget
  if (this.budget > 20000000) {
    this.score = 'High';
  } else if (this.budget >= 10000000 && this.budget <= 20000000) {
    this.score = 'Medium';
  } else {
    this.score = 'Low';
  }

  // Update updatedAt timestamp
  this.updatedAt = new Date();

  next();
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
