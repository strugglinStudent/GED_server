const mongoose = require('mongoose');

const mongoUri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/admin`;

const setupMongoServer = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.info('Database connected successfully !!');
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = setupMongoServer;
