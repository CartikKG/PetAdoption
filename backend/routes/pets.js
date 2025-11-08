const express = require('express');
const { body, validationResult } = require('express-validator');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.species) filter.species = req.query.species;
    if (req.query.breed) filter.breed = { $regex: req.query.breed, $options: 'i' };
    if (req.query.age) {
      const age = parseInt(req.query.age);
      if (age === 0) filter.age = { $lt: 1 };
      else if (age === 1) filter.age = { $gte: 1, $lt: 3 };
      else if (age === 3) filter.age = { $gte: 3, $lt: 7 };
      else if (age === 7) filter.age = { $gte: 7 };
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { breed: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = 'available';
    }

    const pets = await Pet.find(filter)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Pet.countDocuments(filter);

    res.json({
      pets,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPets: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('addedBy', 'name email');
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/',
  protect,
  admin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('species').notEmpty().withMessage('Species is required'),
    body('breed').notEmpty().withMessage('Breed is required'),
    body('age').isNumeric().withMessage('Age must be a number'),
    body('gender').isIn(['Male', 'Female', 'Unknown']).withMessage('Invalid gender'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const pet = await Pet.create({
        ...req.body,
        addedBy: req.user._id,
      });
      res.status(201).json(pet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  '/:id',
  protect,
  admin,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('age').optional().isNumeric().withMessage('Age must be a number'),
    body('gender').optional().isIn(['Male', 'Female', 'Unknown']).withMessage('Invalid gender'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const pet = await Pet.findById(req.params.id);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      Object.assign(pet, req.body);
      await pet.save();
      res.json(pet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await Adoption.deleteMany({ pet: pet._id });
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/adoptions', protect, admin, async (req, res) => {
  try {
    const adoptions = await Adoption.find({ pet: req.params.id })
      .populate('user', 'name email')
      .populate('pet', 'name');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

