const express = require('express')
const { User, validate } = require('../models/user')

const router = express.Router()

router.get('/', async (req, res) => {
    let users = await User.find().sort('name')
    res.send(users)
})


router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if (!user) return res.status(404).send('no such user')
        res.send(user)
    }
    catch (err) {
        // 捕获 CastError: Cast to ObjectId failed 
        return res.status(404).send('no such user')
    }
})


router.post('/', async (req, res) => {
    //先做input validatiion
    let { error } = validate(req.body) //对象解构赋值, es6的语法
    if (error) return res.status(400).send(error.details[0].message)

    //save posted data 
    let user = new User({ name: req.body.name, email: req.body.email })
    user = await user.save()

    //发送响应报文, 将新增的数据项也发回,至于实际生产环境中响应体到底该放啥内容,以及是否在其中启用自定义状态码等,有待进一步确认
    res.status(201)
    res.send(user)
})


router.put('/:id', async (req, res) => {
    try {
        //先做input validation
        let { error } = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        //输入验证通过,再发给数据库做更新 
        let user = await User.findByIdAndUpdate(req.params.id,
            { name: req.body.name },
            { new: true })
        if (!user) return res.status(404).send('no such user')

        //更新成功, echo新增的数据项
        res.send(user)
    }
    catch (err) {
        return res.status(404).send('no such user')
    }
})


router.delete('/:id', async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).send('no such user')
        res.send(user)
    }
    catch (err) {
        return res.status(404).send('no such user')
    }

})


module.exports = router