import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['course', 'book', 'video', 'article', 'website', 'other']
  },
  link: String,
  description: String
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String
});

const CertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  provider: String,
  link: String
});

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: String,
  skills: [String],
  resources: [ResourceSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  order: {
    type: Number,
    required: true
  }
});

const RoadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a roadmap title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a roadmap description']
  },
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  },
  estimatedDuration: String,
  milestones: [MilestoneSchema],
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
  },
  userBackground: {
    education: String,
    experience: String,
    skills: [String]
  }
});

export default mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);