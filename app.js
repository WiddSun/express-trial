 //启用debug模块, 代替console.log, 设置DEBUG环境变量来控制输出哪些调试信息, 
 //export DEBUG='app:startup'; export DEBUG='app:startup,app:db'; export DEBUG='app:*', 通过设置不同DEBUG的值来查看不同的调试信息
const startupDebugger = require('debug')('app:startup')
const dbDebuger = require('debug')('app:db')
const config = require('config')
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

//获取node开发环境的变量, 借此根据不同运行环境启用不同中间件 使用process.env.NODE_ENV=='development'获取NODE_ENV的值
//app.get('env')也是获取NODE_ENV的值, 区别是,若NODE_ENV未设置,则app.get('env')默认是development
 if (app.get('env') == 'development') {
    startupDebugger('morgan enabled')
    app.use(morgan('tiny'))  //用来记日志的,参数用来指定记录的详略程度, 有损性能,测试开发环境使用
 }

 dbDebuger('Connected to the database')

 /*
 config该模块通过调用app.get('env')来获取NODE_ENV的值来加载./config目录下同名的json配置文件(先加载的default.json,再加载同名配置文件,若设置的值没有对应的配置文件则会报错)
 再获取配置文件中定义的值,使得能够根据配置文件来启用不同功能, 用rc模块也可以,且更流行,但mosh偏好config; java框架中是利用反射和properties文件来实现同样效果
 典型操作: 在不同运行环境中连接使用不同数据库
 为了防止将密钥、密码或其它隐私信息写在源码中被推到代码库中, 应使用环境变量传值,在./config目录下创建一个名为custom-environment-variables.json的文件,文件名不可错
 在其中放上需要从环境变量中获取的配置项, config模块会做一个映射,从而使得可以同样通过config.get('password')从环境变量获得该值
*/
console.log("Application Name: " + config.get('name'))
console.log("Mail Server: " + config.get('mail.host'))
try {
    console.log('Mail Password: ' + config.get('mail.password'))
}
catch (e) {
    console.error(e.message, '\n提示: 先设置mail_password这个环境变量然后再运行')
    process.exit(1)
}



//使用自定义的中间件
app.use(falange)


//使用中间件的方式来调用分路由器处理请求; 集中式的总路由,到具体各个分路由中的分散路由,兼顾两种风格
app.use('/api/items', items)
app.use('/', home)


const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))
