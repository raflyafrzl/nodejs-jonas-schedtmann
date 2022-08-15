const app = require('./app');
require('dotenv').config();
console.log(process.env.USER);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Running on port ' + PORT);
});
