const express = require('express');
const path = require('path');
const app = express();

// Serve i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint API per gli episodi
app.get('/api/episodi', (req, res) => {
  const episodi = require('./public/data/episodi.json');
  res.json(episodi);
});

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});