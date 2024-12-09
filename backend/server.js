const app = require('./app');
const debug = require('debug')('app:server'); // Define a namespace for logs


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  debug(`Server running on port ${PORT}`); // Log server start
});
