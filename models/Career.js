import mongoose from 'mongoose';

const CareerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a career title'],
    trim: true,
    maxlength: [100, 'Career title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a career description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Technology', 'Design', 'Business', 'Healthcare', 'Marketing', 'Education', 'Other']
  },
  skills: [{
    type: String,
    trim: true
  }],
  educationRequirements: {
    type: String
  },
  careerPath: {
    type: String
  },
  salaryRanges: {
    entry: String,
    mid: String,
    senior: String
  },
  trends: {
    type: String
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Add text index for search
CareerSchema.index({ title: 'text', description: 'text', skills: 'text' });

export default mongoose.models.Career || mongoose.model('Career', CareerSchema);