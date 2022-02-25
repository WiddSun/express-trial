//demo for using template, namely, mvc pattern, server side rendering
let express = require('express')

let app = express()

//设置模版引擎, 并设置模版文件的存放目录
app.set('view engine', 'pug')
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index',{name: 'tom', title: 'node_mvc_demo'})
})

let port = 8000
app.listen(port, () => console.log('mvc app start, port 8000'))
