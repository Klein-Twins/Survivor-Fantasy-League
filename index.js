const app = require('./app');
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export the app for testing