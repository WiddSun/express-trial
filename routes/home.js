
//主页使用模版引擎,进行后端渲染,以便SEO
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index', { 
        title: 'express-trial',
        header: 'hello, world', 
        message: 'home page rendered by pug with express' 
    })
})

module.exports = router