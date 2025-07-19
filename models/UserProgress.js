import mongoose from 'mongoose';

const CompletedItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['resource', 'project', 'certification'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const MilestoneProgressSchema = new mongoose.Schema({
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completedItems: [CompletedItemSchema],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date
});

const UserProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roadmap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  milestoneProgress: [MilestoneProgressSchema],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date
});

// Compound index to ensure a user can only have one progress record per roadmap
UserProgressSchema.index({ user: 1, roadmap: 1 }, { unique: true });

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);