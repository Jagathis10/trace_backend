import express from 'express';
import cors from 'cors';


import connectDB from './src/db/index.js'
import routes from './src/routes/route.js';

const app = express();
const PORT = 3000; 
connectDB();

// Middleware
app.use(express.urlencoded({extended:true}))
app.use(cors("*"));
app.use(express.json());

//port
app.listen(PORT, () => {
  console.log(`Server running at:${PORT}`);
});

// Routes
app.use('/api', routes);


export default app;
