const app = require('./src/app');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/env');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🦐 Fasfoor server running on port ${PORT}`);
  });
});
