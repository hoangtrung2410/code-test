const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('express-async-handler');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRouter = require('./src/routers/authRouter');
const userRouter = require('./src/routers/userRouter');
const adminRouter = require('./src/routers/adminRouter');


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
