require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');
// Backend port change for testing
const PORT = process.env.PORT || 7891;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
