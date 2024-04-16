const express = require('express');
const app = express();
const port  = 8000;
const mongoose = require('mongoose');
const {model,Schema} = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const User = model('user', userSchema);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

app.get('/', function(req, res) {
    return res.json('hello world')
});

app.post('/register', async function(req, res) {
    const {email,password,name} = req.body;
    const oldUser = await User.find({email: email});
    if(oldUser.length > 0){
        return res.json({msg: 'email already exists'});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name: name,
        email: email,
        password:hashPassword,
    });
    await newUser.save();
    return res.json({msg:'success'});
})
    
app.listen(port,()=>{
    console.log('Server is running on port 8000 , localhost:8000');
})

mongoose.connect('mongodb://localhost:27017/users').then(()=>{
    console.log('connected to mongoDB');
}).catch(err=>{
    console.log(err);
})