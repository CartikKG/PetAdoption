const express = require('express');
const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { petId, message } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }

    const existingAdoption = await Adoption.findOne({
      pet: petId,
      user: req.user._id,
    });

    if (existingAdoption) {
      return res.status(400).json({ message: 'You have already applied for this pet' });
    }

    const adoption = await Adoption.create({
      pet: petId,
      user: req.user._id,
      message: message || '',
    });

    await adoption.populate('pet', 'name species breed');
    await adoption.populate('user', 'name email');

    res.status(201).json(adoption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-applications', protect, async (req, res) => {
  try {
    const adoptions = await Adoption.find({ user: req.user._id })
      .populate('pet', 'name species breed age gender imageUrl')
      .sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate('pet', 'name species breed')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id).populate('pet');
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption application not found' });
    }

    adoption.status = 'approved';
    await adoption.save();

    const pet = adoption.pet;
    pet.status = 'adopted';
    await pet.save();

    await Adoption.updateMany(
      { pet: pet._id, _id: { $ne: adoption._id }, status: 'pending' },
      { status: 'rejected' }
    );

    await adoption.populate('user', 'name email');
    await adoption.populate('pet', 'name species breed');

    res.json(adoption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/reject', protect, admin, async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id);
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption application not found' });
    }

    adoption.status = 'rejected';
    await adoption.save();

    await adoption.populate('user', 'name email');
    await adoption.populate('pet', 'name species breed');

    res.json(adoption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

