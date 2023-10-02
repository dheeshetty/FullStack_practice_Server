const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static('./public'))
app.use(cors());

const User = mongoose.model('User', {
  first_name: String,
  last_name: String,
  email: String,
  avatar: String
});

app.get('/', (req, res) => {
  res.json({ status: 'SUCCESS', message: 'All good!'})
})

//GET /users (Read)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json({ 
      status: 'SUCCESS', 
      data: users
    })
  } catch (err) {
    res.status(500).json({ 
      status: 'FAIL', 
      message: 'Something went wrong'
    })
  }
});

// POST /users (Create)
app.post('/users', async (req, res) => {
  try {
    const { first_name, last_name, email, avatar } = req.body; 
    await User.create({ first_name, last_name, email, avatar })
    res.json({ 
      status: 'SUCCESS', 
      message: 'User added successfully!'
    })
  } catch (err) {
    res.status(500).json({ 
      status: 'FAIL', 
      message: 'Something went wrong'
    })
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log(`Server running on http://localhost:${process.env.PORT}`))
    .catch(error => console.log(error));
})