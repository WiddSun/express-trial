const express = require('express')
const items = require('./routes/items')
const home = require('./routes/home')

const app = express()
//设置模版引擎, 并设置模版文件的存放目录,用于主页的渲染
app.set('view engine', 'pug')
app.set('views', './views')
//加一个中间件,其作用是解析请求体的json格式数据,使得可以通过req.body.name来引用
app.use(express.json())
//该中间件用于解析请求体中的qs,使得可通过req.body.name来引用, 如此一来该api便可同时解析两种格式的请求体数据了,方便前端调用
app.use(express.urlencoded({ extended:true }))
app.use(express.static('static'))
//使用中间件的方式来调用分路由器处理请求; 集中式的总路由,到具体各个分路由中的分散路由,兼顾两种风格
app.use((req, res, next) => {
    console.log('logging...')
    next()
})
app.use('/api/items', items)
app.use('/', home)


const port = process.env.PORT || 8000
app.listen(port, () => console.log(`api app start, port ${port}`))

 