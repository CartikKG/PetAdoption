const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kartikguptampi_db_user:39CmKWF0304c2PIg@cluster0.qquclrw.mongodb.net/petadoption', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', async(req,res)=>{

return res.json({message:"Hello World"});
});
app.use('/api/pets', require('./routes/pets'));
app.use('/api/adoptions', require('./routes/adoptions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

