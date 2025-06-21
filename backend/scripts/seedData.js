import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const sampleProducts = [
  {
    title: "Sunset Over Mountains",
    description: "A breathtaking landscape painting capturing the golden hour over majestic mountain peaks. The warm colors blend seamlessly to create a sense of peace and tranquility.",
    price: 450,
    artist: "Elena Rodriguez",
    category: "landscape",
    medium: "Oil on Canvas",
    dimensions: "24\" x 36\"",
    year: 2023,
    images: ["https://images.pexels.com/photos/1070542/pexels-photo-1070542.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["sunset", "mountains", "landscape", "nature"],
    featured: true,
    rating: 4.8,
    numReviews: 24
  },
  {
    title: "Abstract Dreams",
    description: "A vibrant abstract composition that explores the relationship between color and emotion. Bold strokes and dynamic forms create a sense of movement and energy.",
    price: 320,
    artist: "Marcus Chen",
    category: "abstract",
    medium: "Acrylic on Canvas",
    dimensions: "20\" x 24\"",
    year: 2024,
    images: ["https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["abstract", "colorful", "modern", "contemporary"],
    featured: true,
    rating: 4.6,
    numReviews: 18
  },
  {
    title: "Portrait of Grace",
    description: "An elegant portrait showcasing masterful technique in capturing human emotion and character. The subtle use of light and shadow brings the subject to life.",
    price: 680,
    artist: "Isabella Thompson",
    category: "portrait",
    medium: "Oil on Canvas",
    dimensions: "18\" x 24\"",
    year: 2023,
    images: ["https://images.pexels.com/photos/1560424/pexels-photo-1560424.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["portrait", "realistic", "classical", "elegant"],
    featured: false,
    rating: 4.9,
    numReviews: 31
  },
  {
    title: "Still Life with Flowers",
    description: "A delicate still life arrangement featuring fresh flowers in a vintage vase. The composition demonstrates perfect balance and attention to detail.",
    price: 280,
    artist: "David Park",
    category: "still-life",
    medium: "Watercolor on Paper",
    dimensions: "16\" x 20\"",
    year: 2024,
    images: ["https://images.pexels.com/photos/1324803/pexels-photo-1324803.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["flowers", "still-life", "watercolor", "delicate"],
    featured: false,
    rating: 4.5,
    numReviews: 12
  },
  {
    title: "Urban Symphony",
    description: "A modern interpretation of city life through bold geometric forms and vibrant colors. This piece captures the energy and rhythm of urban environments.",
    price: 520,
    artist: "Sofia Andersson",
    category: "modern",
    medium: "Mixed Media on Canvas",
    dimensions: "30\" x 40\"",
    year: 2024,
    images: ["https://images.pexels.com/photos/1070542/pexels-photo-1070542.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["urban", "modern", "geometric", "colorful"],
    featured: true,
    rating: 4.7,
    numReviews: 22
  },
  {
    title: "Classical Harmony",
    description: "A timeless piece inspired by classical masters, featuring perfect proportions and traditional techniques. This painting embodies the beauty of classical art.",
    price: 750,
    artist: "Alessandro Rossi",
    category: "classical",
    medium: "Oil on Canvas",
    dimensions: "24\" x 30\"",
    year: 2023,
    images: ["https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["classical", "traditional", "masterpiece", "timeless"],
    featured: false,
    rating: 4.8,
    numReviews: 28
  },
  {
    title: "Ocean Waves",
    description: "Dynamic seascape capturing the power and beauty of ocean waves. The artist's skillful use of blues and whites creates a sense of movement and depth.",
    price: 390,
    artist: "Marina Kowalski",
    category: "landscape",
    medium: "Oil on Canvas",
    dimensions: "22\" x 28\"",
    year: 2024,
    images: ["https://images.pexels.com/photos/1560424/pexels-photo-1560424.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["ocean", "waves", "seascape", "blue"],
    featured: false,
    rating: 4.6,
    numReviews: 19
  },
  {
    title: "Geometric Patterns",
    description: "An exploration of mathematical beauty through geometric patterns and precise lines. This abstract work demonstrates the harmony found in geometric relationships.",
    price: 340,
    artist: "James Wilson",
    category: "abstract",
    medium: "Acrylic on Canvas",
    dimensions: "20\" x 20\"",
    year: 2024,
    images: ["https://images.pexels.com/photos/1324803/pexels-photo-1324803.jpeg?auto=compress&cs=tinysrgb&w=800"],
    tags: ["geometric", "patterns", "mathematical", "precise"],
    featured: false,
    rating: 4.4,
    numReviews: 15
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/painting-marketplace');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@artmarket.com' });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@artmarket.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();