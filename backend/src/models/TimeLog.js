const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
      min: 0,
    },
    isRunning: {
      type: Boolean,
      default: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound indexes for efficient queries ─────────────────────────────────────
timeLogSchema.index({ userId: 1, startTime: -1 });
timeLogSchema.index({ taskId: 1, userId: 1 });
timeLogSchema.index({ userId: 1, isRunning: 1 });

// ─── Virtual: formatted duration ────────────────────────────────────────────────
timeLogSchema.virtual('formattedDuration').get(function () {
  const secs = this.duration;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

const TimeLog = mongoose.model('TimeLog', timeLogSchema);
module.exports = TimeLog;
