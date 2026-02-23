const express = require('express');
const cookies = require('cookie-parser')
const app = express();


const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes');
const userRouter = require('./routes/user.routes')

app.use(express.json());
app.use(cookies())


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRouter);

module.exports = app;