const express = require('express');
const router = express.Router();


const authRoutes = require("./authRoutes")
const userRoutes = require('./userRoutes')
const blogRoutes = require('./blogRoutes')
const turnRoutes = require('./turnRoutes')
const paymentRoutes = require('./paymentRoutes')

router.get('/' , (req , res) => {
    res.send('home page')
})

// Auth routes
router.use('/api/auth' , authRoutes.router)

// user routes
router.use('/api/user' , userRoutes.router)

// blog routes
router.use('/api/blog' , blogRoutes.router)

// turn routes
router.use('/api/turn' , turnRoutes.router)

// payment routes
router.use('/api/payment' , paymentRoutes.router)


module.exports = router;