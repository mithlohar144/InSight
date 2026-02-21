const express = require('express');
const cookies = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookies())


app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes);

module.exports = app;