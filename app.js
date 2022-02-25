let Joi = require('joi') //导入joi模块,做input validaion
let express = require('express')
let app = express()

//加一个中间件,其作用是解析请求体的json格式数据,使得可以通过req.body.name来引用
app.use(express.json())
//如一个数组暂时代替数据库来存数据
let items = [
    { id: 1, name: 'apple' },
    { id: 2, name: 'orange' },
    { id: 3, name: 'banana' },
]

app.get('/', (req, res) => {
    res.send('hello, express\n')
})


app.get('/api/items', (req, res) => {
    res.send(items)
})


app.get('/api/items/:id', (req, res) => {
    let item = items.find(i => i.id == req.params.id)
    if (!item) return res.status(404).send('no such item')
    res.send(item)
})


app.post('/api/items', (req, res) => {
    let { error } = validateItem(req.body) //对象解构赋值, es6的语法
    if (error) return res.status(400).send(error.details[0].message)
    //save posted data 
    let item = {
        id: items.length + 1,
        name: req.body.name,
    }
    items.push(item)
    res.status(201)
    res.send("item created successfully")
})


app.put('/api/items/:id', (req, res) => {
    //先验证要修改的项目是否存在, 不存在则返回404,存在则下一步, 复制相应get请求代码即可
    let item = items.find(i => i.id == req.params.id)
    if (!item) return res.status(404).send('no such item')
    let { error } = validateItem(req.body) 
    if (error) return res.status(400).send(error.details[0].message)
    //项目存在,且提交的数据合法,执行赋值更新操作即可
    item.name = req.body.name
    res.send('item updated successfully')

})
//holy crap

//提取出post和put中重复代码,封装成该验证函数
function validateItem(item) {
    let schema = {
        name: Joi.string()
            .min(3)
            .alphanum()
            .required()
    }
    return Joi.validate(item, schema)
}


app.delete('/api/items/:id', (req, res) => {
    //先验证所改项目是否存在
    let item = items.find(i => i.id == req.params.id)
    if (!item) return res.status(404).send('no such item') 
    //项目存在,执行删除操作
    let index = items.indexOf(item)
    items.splice(index, 1) //splice用法从指定位置删除n个元素,并返回所删除元素的数组
    res.send(`item ${req.params.id} delete`)
})


let port = process.env.PORT || 8000
app.listen(port, () => console.log('node server start'))