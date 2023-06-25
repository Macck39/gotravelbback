import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import userdata from './routes/index.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();


// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use("/api", userdata);

  app.use((req, res, next) => {
    console.log('Request received!');
    next(); // Pass control to the next middleware function
  });



  // app.use((err, req, res, next) => {
  //   const status = err.status || 500;
  //   const message = err.message || "Something went wrong!";
  //   return res.status(status).json({
  //     success: false,
  //     status,
  //     message,
  //   });
  // });
 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));