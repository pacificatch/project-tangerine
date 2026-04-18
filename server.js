const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tangerine is running at http://localhost:${PORT}`);
  console.log(`On your network: http://192.168.1.96:${PORT}`);
});
