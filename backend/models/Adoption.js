const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

adoptionSchema.index({ pet: 1, user: 1 });

module.exports = mongoose.model('Adoption', adoptionSchema);

