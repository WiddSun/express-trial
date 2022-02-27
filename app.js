const morgan = require('morgan')
const items = require('./routes/items')
const home = require('./routes/home')
const falange = require('./middleware/falange')
const helmet = require('helmet')
const express = require('express')
const app = express()

//设置模版引擎, 并设置模版文件的存放目录,用于主页的渲染
app.set('view engine', 'pug')
app.set('views', './views')

//加一个中间件,其作用是解析请求体的json格式数据,使得可以通过req.body.name来引用
app.use(express.json())
//该中间件用于解析请求体中的qs,使得可通过req.body.name来引用, 如此一来该api便可同时解析两种格式的请求体数据了,方便前端调用
app.use(express.urlencoded({ extended:true }))

//处理静态资源文件的请求
app.use(express.static('static'))

//为响应报文增加一些与安全相关的首部
app.use(helmet()) 

//用来记日志的,参数用来指定记录的详略程度, 有损性能,测试开发环境使用
app.use(morgan('tiny'))

//使用自定义的中间件
app.use(falange)

//使用中间件的方式来调用分路由器处理请求; 集中式的总路由,到具体各个分路由中的分散路由,兼顾两种风格
app.use('/api/items', items)
app.use('/', home)


const port = process.env.PORT || 8000
app.listen(port, () => console.log(`server start, port ${port}`))
