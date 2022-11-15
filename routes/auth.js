const router = require('express').Router();
const User = require('../models/User.js');
const jwt = require("jsonwebtoken");

const CryptoJS = require("crypto-js");

//Register API
router.post('/register', async (req, res) => {
    try{
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
        });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
});

//Login API
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email})
        !user && res.status(400).json("Wrong Creadentials");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const validatedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        validatedPassword !== req.body.password && res.status(422).json("Incorrect Password");

        const accessToken = jwt.sign({
            id:user._id, 
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
        {expiresIn:"3d"}
        );

        const { password, ...others } = user._doc;//Because we not sending password
        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;