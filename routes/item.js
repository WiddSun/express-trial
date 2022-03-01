const express = require('express')
const {Item, validate} = require('../models/item')

const router = express.Router()

router.get('/', async (req, res) => {
    let items = await Item.find().sort('name')
    res.send(items)
})


router.get('/:id', async (req, res) => {
    try {
        let item = await Item.findById(req.params.id)
        if (!item) return res.status(404).send('no such item')
        res.send(item)
    }
    catch (err) {
        // 捕获 CastError: Cast to ObjectId failed 
        return res.status(404).send('no such item')
    }
})


router.post('/', async (req, res) => {
    //先做input validatiion
    let { error } = validate(req.body) //对象解构赋值, es6的语法
    if (error) return res.status(400).send(error.details[0].message)

    //save posted data 
    let item = new Item({ name: req.body.name })
    item = await item.save()

    //发送响应报文, 将新增的数据项也发回,至于实际生产环境中响应体到底该放啥内容,以及是否在其中启用自定义状态码等,有待进一步确认
    res.status(201)
    res.send(item)
})


router.put('/:id', async (req, res) => {
    try {
        //先做input validation
        let { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        //输入验证通过,再发给数据库做更新 
        let item = await Item.findByIdAndUpdate(req.params.id,
            { name: req.body.name },
            { new: true })
        if (!item) return res.status(404).send('no such item')

        //更新成功, echo新增的数据项
        res.send(item)
    }
    catch (err) {
        return res.status(404).send('no such item')
    }

})


router.delete('/:id', async (req, res) => {
    try {
        let item = await Item.findByIdAndDelete(req.params.id)
        if (!item) return res.status(404).send('no such item')
        res.send(item)
    }
    catch (err) {
        return res.status(404).send('no such item')
    }

})


module.exports = router