const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../utils/config");

logger.info("connecting to", config.MONGODB_URI);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    logger.info(`Connected to the database`, conn.connection.host);
  } catch (error) {
    logger.error("error connecting to database:", e);
    process.exit(1);
  }
};

module.exports = connectDB;
