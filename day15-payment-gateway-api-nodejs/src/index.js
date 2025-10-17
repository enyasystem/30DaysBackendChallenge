const app = require('./app');
const config = require('./config');
const PORT = config.PORT || 3000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
