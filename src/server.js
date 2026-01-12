require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth'); // <- path to auth.js

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount auth routes at /auth
app.use('/auth', authRoutes);

// Health check
app.get('/', (req, res) => res.send('CardCollectz backend is running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
