const Joi = require('joi')  //导入joi模块,做input validaion
const express = require('express')

const router = express.Router()
//用一个数组暂时代替数据库来存数据
let items = [
    { id: 1, name: 'routerle' },
    { id: 2, name: 'orange' },
    { id: 3, name: 'banana' },
]

router.get('/', (req, res) => {
    res.send(items)
})


router.get('/:id', (req, res) => {
    let item = items.find(i => i.id == req.params.id)
    if (!item) return res.status(404).send('no such item')
    res.send(item)
})


router.post('/', (req, res) => {
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


router.put('/:id', (req, res) => {
    //先验证要修改的项目是否存在, 不存在则返回404,存在则下一步, 复制相应get请求代码即可
    let item = items.find(i => i.id == req.params.id)
    if (!item) return res.status(404).send('no such item')
    let { error } = validateItem(req.body) 
    if (error) return res.status(400).send(error.details[0].message)
    //项目存在,且提交的数据合法,执行赋值更新操作即可
    item.name = req.body.name
    res.send('item updated successfully')

})


function validateItem(item) {
    let schema = {
        name: Joi.string()
            .min(3)
            .alphanum()
            .required()
    }
    return Joi.validate(item, schema)
}


router.delete('/:id', (req, res) => {
    //先验证所改项目是否存在
    let item = items.find(i => i.id == req.params.id)
    if (!item) return res.status(404).send('no such item') 
    //项目存在,执行删除操作
    let index = items.indexOf(item)
    items.splice(index, 1) //splice用法从指定位置删除n个元素,并返回所删除元素的数组
    res.send(`item ${req.params.id} delete`)
})

module.exports = router