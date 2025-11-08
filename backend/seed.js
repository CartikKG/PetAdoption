const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Pet = require('./models/Pet');

const dummyPets = [
  {
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    description: 'Friendly and energetic Golden Retriever who loves playing fetch and going on walks. Great with children and other pets.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
    status: 'available'
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 1,
    gender: 'Female',
    description: 'Beautiful Persian cat with long silky fur. Very calm and affectionate, perfect for a quiet home.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500',
    status: 'available'
  },
  {
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 3,
    gender: 'Male',
    description: 'Loyal and intelligent German Shepherd. Well-trained and excellent with families. Needs regular exercise.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
    status: 'available'
  },
  {
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 2,
    gender: 'Male',
    description: 'Large and friendly Maine Coon cat. Very social and loves attention. Gets along well with other pets.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500',
    status: 'available'
  },
  {
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    age: 4,
    gender: 'Male',
    description: 'Playful and friendly Labrador. Great family dog who loves water and outdoor activities.',
    imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500',
    status: 'available'
  },
  {
    name: 'Milo',
    species: 'Cat',
    breed: 'British Shorthair',
    age: 1,
    gender: 'Male',
    description: 'Cute and cuddly British Shorthair kitten. Very playful and curious. Perfect for first-time cat owners.',
    imageUrl: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=500',
    status: 'available'
  },
  {
    name: 'Bella',
    species: 'Dog',
    breed: 'Beagle',
    age: 2,
    gender: 'Female',
    description: 'Sweet and gentle Beagle. Great with kids and loves to explore. Needs regular walks.',
    imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500',
    status: 'available'
  },
  {
    name: 'Sophie',
    species: 'Cat',
    breed: 'Siamese',
    age: 3,
    gender: 'Female',
    description: 'Elegant Siamese cat with striking blue eyes. Very vocal and affectionate. Prefers quiet environment.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500',
    status: 'available'
  },
  {
    name: 'Rocky',
    species: 'Dog',
    breed: 'Bulldog',
    age: 5,
    gender: 'Male',
    description: 'Calm and friendly Bulldog. Low energy dog perfect for apartment living. Very loyal companion.',
    imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=500',
    status: 'available'
  },
  {
    name: 'Daisy',
    species: 'Cat',
    breed: 'Ragdoll',
    age: 2,
    gender: 'Female',
    description: 'Gentle Ragdoll cat that goes limp when picked up. Very affectionate and perfect for families.',
    imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=500',
    status: 'available'
  },
  {
    name: 'Oscar',
    species: 'Dog',
    breed: 'Poodle',
    age: 1,
    gender: 'Male',
    description: 'Intelligent and hypoallergenic Poodle. Great for families with allergies. Needs regular grooming.',
    imageUrl: 'https://images.unsplash.com/photo-1616190172456-62e5c343e999?w=500',
    status: 'available'
  },
  {
    name: 'Ruby',
    species: 'Cat',
    breed: 'Scottish Fold',
    age: 1,
    gender: 'Female',
    description: 'Adorable Scottish Fold with unique folded ears. Very friendly and playful. Loves cuddling.',
    imageUrl: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?w=500',
    status: 'available'
  },
  {
    name: 'Cooper',
    species: 'Dog',
    breed: 'Border Collie',
    age: 2,
    gender: 'Male',
    description: 'Highly intelligent Border Collie. Needs lots of mental and physical stimulation. Great for active owners.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500',
    status: 'available'
  },
  {
    name: 'Lily',
    species: 'Cat',
    breed: 'Bengal',
    age: 2,
    gender: 'Female',
    description: 'Active and playful Bengal cat. Loves climbing and playing. Very social and needs attention.',
    imageUrl: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500',
    status: 'available'
  },
  {
    name: 'Toby',
    species: 'Dog',
    breed: 'Cocker Spaniel',
    age: 3,
    gender: 'Male',
    description: 'Friendly and cheerful Cocker Spaniel. Great family dog with a loving personality. Needs regular exercise.',
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889dbdf1bb?w=500',
    status: 'available'
  },
  {
    name: 'Oliver',
    species: 'Cat',
    breed: 'Russian Blue',
    age: 2,
    gender: 'Male',
    description: 'Shy but affectionate Russian Blue. Beautiful gray coat and green eyes. Prefers quiet households.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500',
    status: 'available'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kartikguptampi_db_user:39CmKWF0304c2PIg@cluster0.qquclrw.mongodb.net/petadoption', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Pet.deleteMany({});

    console.log('Cleared existing data');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Created admin user: admin@example.com / admin123');

    const testUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Created test user: user@example.com / user123');

    for (const petData of dummyPets) {
      await Pet.create({
        ...petData,
        addedBy: adminUser._id
      });
    }

    console.log(`Created ${dummyPets.length} pets`);

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

