const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("./utils/logger.js");

const booksData = require("./data/books.json");
const usersData = require("./data/users.json");

const Book = require("./models/book.js");
const User = require("./models/user.js");

const connectDB = require("./config/db.js");

const seedUsers = async () => {
  let count = 0;

  try {
    await User.deleteMany();

    for (const user of usersData) {
      await User.create(user);
      count++;
    }

    logger.info(`${count} users seeded successfully!`);
  } catch (error) {
    logger.error("Error seeding users:", error);
    process.exit(1);
  }
};

const seedBooks = async () => {
  try {
    await Book.deleteMany();

    const books = await Book.insertMany(booksData);
    logger.info(`${books.length} books seeded successfully!`);
  } catch (error) {
    logger.error("Error seeding books:", error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedUsers();
  await seedBooks();
  mongoose.connection.close();
};

runSeeder().catch((error) => {
  logger.error("Error in seeder:", error);
  process.exit(1);
});
